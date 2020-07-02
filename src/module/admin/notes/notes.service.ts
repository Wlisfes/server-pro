import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UtilsService } from '@/common/utils/utils.service'
import { NotesLoggerService } from '@/module/admin/logger/notes-logger/notes-logger.service'
import { TagEntity } from '@/entity/tag.entity'
import { UserEntity } from '@/entity/user.entity'
import { NotesEntity } from '@/entity/notes.entity'
import * as NotesDto from '@/module/admin/notes/notes.dto'
import * as day from 'dayjs'

@Injectable()
export class NotesService {
	constructor(
		private readonly utilsService: UtilsService,
		private readonly logger: NotesLoggerService,
		@InjectRepository(TagEntity) private readonly tagModel: Repository<TagEntity>,
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
		@InjectRepository(NotesEntity) private readonly notesModel: Repository<NotesEntity>
	) {}

	//创建笔记
	public async createNotes(params: NotesDto.CreateNotesDto, uid: number) {
		try {
			if (params.tag.length < 1) {
				throw new HttpException('所属标签最少需要一个', HttpStatus.BAD_REQUEST)
			}

			const user = await this.userModel.findOne({ where: { uid } })
			const tag = await this.tagModel
				.createQueryBuilder('tag')
				.where('tag.id IN (:id)', { id: params.tag })
				.getMany()

			const notes = await this.notesModel.create({
				title: params.title,
				picUrl: params.picUrl,
				content: params.content,
				html: params.html,
				themeName: params.themeName,
				status: params.status || 1
			})

			const { id } = await this.notesModel.save({ ...notes, user, tag })
			const T = await this.findIdNotes(id)

			//写入笔记创建日志
			await this.logger.createNotesLogger(uid, T)

			return T
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//获取所有笔记
	public async findNotesAll(params: NotesDto.FindNotesDto) {
		const { uid, status, tag, createTime } = params

		const U = await this.utilsService.filter('user', 'user', ['article', 'project', 'notes', 'tag', 'role', 'auth'])
		const T = await this.utilsService.filter('tag', 'tag', ['sort', 'user', 'article', 'notes', 'project'])
		const N = await this.utilsService.filter('notes', 'notes', ['user', 'tag'])

		const where = {}

		const QB = await this.notesModel
			.createQueryBuilder('notes')
			.select([].concat(U, T, N))
			.leftJoin('notes.user', 'user')
			.leftJoin('notes.tag', 'tag')
			.orderBy({ 'notes.sort': 'DESC', 'notes.createTime': 'DESC' })

		//uid筛选
		if (uid !== undefined && uid !== null) {
			QB.where('user.uid = :uid', { uid: params.uid })
		}

		//时间范围筛选
		if (createTime !== undefined && createTime !== null && createTime !== '') {
			QB.andWhere('notes.createTime BETWEEN :start AND :end', {
				start: params.createTime,
				end: day().toDate()
			})
		}

		//标签筛选
		if (tag !== undefined && tag !== null) {
			QB.andWhere('tag.id = :id', { id: params.tag })
		}

		//状态筛选
		if (status !== undefined && status !== null) {
			QB.andWhere('notes.status = :status', { status: params.status })
		}

		const netes = await QB.getMany()

		if (tag !== undefined && tag !== null && netes.length > 0) {
			return await this.notesModel
				.createQueryBuilder('notes')
				.select([].concat(U, T, N))
				.leftJoin('notes.user', 'user')
				.leftJoin('notes.tag', 'tag')
				.orderBy({ 'notes.sort': 'DESC', 'notes.createTime': 'DESC' })
				.where('notes.id IN (:id)', { id: netes.map(k => k.id) })
				.getMany()
		}
		return netes
	}

	//获取笔记详情
	public async findIdNotes(id: number) {
		try {
			const U = await this.utilsService.filter('user', 'user', [
				'article',
				'project',
				'notes',
				'tag',
				'role',
				'auth'
			])
			const T = await this.utilsService.filter('tag', 'tag', ['sort', 'user', 'article', 'notes', 'project'])
			const N = await this.utilsService.filter('notes', 'notes', ['user', 'tag'])

			const notes = await this.notesModel
				.createQueryBuilder('notes')
				.select([].concat(U, T, N))
				.leftJoin('notes.user', 'user')
				.leftJoin('notes.tag', 'tag')
				.where('notes.id = :id', { id })
				.getOne()

			if (!notes) {
				throw new HttpException(`id: ${id} 错误`, HttpStatus.BAD_REQUEST)
			}

			return notes
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//修改笔记
	public async updateNotes(params: NotesDto.UpdateNotesDto, uid: number) {
		try {
			console.log(params)
			if (params.tag.length < 1) {
				throw new HttpException('所属标签最少需要一个', HttpStatus.BAD_REQUEST)
			}

			const user = await this.userModel.findOne({ where: { uid }, relations: ['role'] })
			const notes = await this.notesModel.findOne({ where: { id: params.id }, relations: ['user', 'tag'] })

			if (!notes) {
				throw new HttpException(`id: ${params.id} 错误`, HttpStatus.BAD_REQUEST)
			}

			if (notes.user.uid !== uid) {
				if (user.role.role_key !== 'admin') {
					throw new HttpException('无法更改他人笔记', HttpStatus.BAD_REQUEST)
				}
			}

			//修改笔记所属标签
			await this.notesModel
				.createQueryBuilder('notes')
				.relation('tag')
				.of(notes)
				.addAndRemove(
					params.tag,
					notes.tag.map(k => k.id)
				)

			//更新笔记内容
			await this.notesModel
				.createQueryBuilder('notes')
				.update({
					title: params.title,
					picUrl: params.picUrl,
					content: params.content,
					html: params.html,
					themeName: params.themeName,
					status: params.status
				})
				.where('notes.id = :id', { id: params.id })
				.execute()

			const T = await this.findIdNotes(params.id)

			//写入笔记修改日志
			await this.logger.updateNotesLogger(uid, T)

			return T
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//置顶笔记权重
	public async updateNotesSort(params: NotesDto.NotesIdDto, uid: number) {
		try {
			const notes = await this.notesModel.findOne({ where: { id: params.id } })
			if (notes) {
				const { sort } = await this.notesModel
					.createQueryBuilder('notes')
					.select('MAX(notes.sort)', 'sort')
					.getRawOne()

				await this.notesModel.update({ id: params.id }, { sort: sort + 1 })
				const T = await this.findIdNotes(params.id)

				//写入笔记权重修改日志
				await this.logger.sortNotesLogger(uid, T)

				return T
			}
			throw new HttpException(`id: ${params.id} 错误`, HttpStatus.BAD_REQUEST)
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//切换笔记状态
	public async cutoverNotes(params: NotesDto.NotesIdDto, uid: number) {
		try {
			const notes = await this.notesModel.findOne({ where: { id: params.id } })
			if (notes) {
				await this.notesModel.update({ id: params.id }, { status: notes.status ? 0 : 1 })
				const T = await this.findIdNotes(params.id)

				//写入笔记状态修改日志
				await this.logger.cutoverNotesLogger(uid, T)

				return T
			}
			throw new HttpException(`id: ${params.id} 错误`, HttpStatus.BAD_REQUEST)
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//删除笔记
	public async deleteNotes(params: NotesDto.NotesIdDto, uid: number) {
		try {
			const notes = await this.notesModel.findOne({ where: { id: params.id } })
			if (notes) {
				const delNotes = await this.notesModel.delete({ id: params.id })
				if (delNotes.affected === 0) {
					throw new HttpException(`id: ${params.id} 错误`, HttpStatus.BAD_REQUEST)
				}

				//写入笔记删除日志
				await this.logger.deleteNotesLogger(uid, notes)

				return delNotes
			}
			throw new HttpException(`id: ${params.id} 错误`, HttpStatus.BAD_REQUEST)
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
