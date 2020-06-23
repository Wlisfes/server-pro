import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UtilsService } from '@/common/utils/utils.service'
import { TagEntity } from '@/entity/tag.entity'
import { UserEntity } from '@/entity/user.entity'
import { ArticleEntity } from '@/entity/article.entity'
import * as TagDto from '@/module/admin/tag/tag.dto'
import * as day from 'dayjs'

@Injectable()
export class TagService {
	constructor(
		private readonly utilsService: UtilsService,
		@InjectRepository(TagEntity) private readonly tagModel: Repository<TagEntity>,
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
		@InjectRepository(ArticleEntity) private readonly articleModel: Repository<ArticleEntity>
	) {}

	//创建标签
	async createTag(params: TagDto.CreateTagDto, uid: number) {
		try {
			const TAG = await this.tagModel.findOne({ where: { name: params.name } })
			if (TAG) {
				throw new HttpException(`username: ${params.name} 已存在`, HttpStatus.BAD_REQUEST)
			}

			//获取uid用户
			const user = await this.userModel.findOne({ where: { uid } })
			const tag = await this.tagModel.create({
				name: params.name,
				color: params.color,
				status: params.status
			})
			const { id } = await this.tagModel.save({ ...tag, user })

			const T = await this.utilsService.filter('tag', 'tag', ['user', 'article', 'notes', 'project'])
			const U = await this.utilsService.filter('user', 'user', [
				'id',
				'article',
				'project',
				'notes',
				'tag',
				'role',
				'auth'
			])
			return await this.tagModel
				.createQueryBuilder('tag')
				.select([].concat(T, U))
				.leftJoin('tag.user', 'user')
				.where('tag.id = :id', { id })
				.getMany()
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//获取所有标签列表
	async findTagAll(params: TagDto.FindTagDto) {
		const { uid, status, createTime } = params
		const T = await this.utilsService.filter('tag', 'tag', ['user', 'article', 'notes', 'project'])
		const U = await this.utilsService.filter('user', 'user', [
			'id',
			'article',
			'project',
			'notes',
			'tag',
			'role',
			'auth'
		])

		const QB = this.tagModel
			.createQueryBuilder('tag')
			.select([].concat(T, U))
			.leftJoin('tag.user', 'user')
			.orderBy({ 'tag.sort': 'DESC', 'tag.createTime': 'DESC' })

		//uid筛选
		if (uid !== undefined && uid !== null) {
			QB.where('user.uid = :uid', { uid: params.uid })
		}

		//时间范围筛选
		if (createTime !== undefined && createTime !== null && createTime !== '') {
			QB.andWhere('tag.createTime BETWEEN :start AND :end', {
				start: params.createTime,
				end: day().toDate()
			})
		}

		//状态筛选
		if (status !== undefined && status !== null) {
			QB.andWhere('tag.status = :status', { status: params.status })
		}

		return await QB.getMany()
	}

	//获取标签详情
	async findIdTag(params: TagDto.TagId) {
		return await this.tagModel.findOne({ where: { id: params.id } })
	}

	//修改标签信息
	async updateTag(params: TagDto.UpdateTagDto) {
		try {
			const name = await this.tagModel.findOne({ where: { name: params.name } })
			if (name && name.id !== params.id) {
				throw new HttpException(`name: ${params.name} 已存在`, HttpStatus.BAD_REQUEST)
			}

			const tag = await this.tagModel.findOne({ where: { id: params.id } })
			if (tag) {
				await this.tagModel.update({ id: params.id }, params)

				return await this.tagModel.findOne({ id: params.id })
			}
			throw new HttpException(`id: ${params.id} 错误`, HttpStatus.BAD_REQUEST)
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//置顶标签权重
	async updateTagSort(params: TagDto.TagId) {
		try {
			const tag = await this.tagModel.findOne({ where: { id: params.id } })
			if (tag) {
				const { sort } = await this.tagModel
					.createQueryBuilder('tag')
					.select('MAX(tag.sort)', 'sort')
					.getRawOne()

				await this.tagModel.update({ id: params.id }, { sort: sort + 1 })
				return await this.tagModel.findOne({ where: { id: params.id } })
			}
			throw new HttpException(`id: ${params.id} 错误`, HttpStatus.BAD_REQUEST)
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//切换标签状态
	async cutoverTag(params: TagDto.TagId) {
		try {
			const tag = await this.tagModel.findOne({ where: { id: params.id } })
			if (tag) {
				await this.tagModel.update({ id: params.id }, { status: tag.status ? 0 : 1 })
				return await this.tagModel.findOne({ where: { id: params.id } })
			}
			throw new HttpException(`id: ${params.id} 错误`, HttpStatus.BAD_REQUEST)
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//删除标签
	async deleteTag(params: TagDto.TagId) {
		try {
			const tag = await this.tagModel.findOne({ where: { id: params.id } })
			if (tag) {
				const delTag = await this.tagModel.delete({ id: params.id })
				if (delTag.affected === 0) {
					throw new HttpException(`id: ${params.id} 错误`, HttpStatus.BAD_REQUEST)
				}
				return delTag
			}
			throw new HttpException(`id: ${params.id} 错误`, HttpStatus.BAD_REQUEST)
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
