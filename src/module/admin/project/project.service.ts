import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UtilsService } from '@/common/utils/utils.service'
import { ProjectLoggerService } from '@/module/admin/logger/project-logger/project-logger.service'
import { TagEntity } from '@/entity/tag.entity'
import { UserEntity } from '@/entity/user.entity'
import { ProjectEntity } from '@/entity/project.entity'
import * as ProjectDto from '@/module/admin/project/project.dto'
import * as day from 'dayjs'

@Injectable()
export class ProjectService {
	constructor(
		private readonly utilsService: UtilsService,
		private readonly logger: ProjectLoggerService,
		@InjectRepository(TagEntity) private readonly tagModel: Repository<TagEntity>,
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
		@InjectRepository(ProjectEntity) private readonly projectModel: Repository<ProjectEntity>
	) {}

	//创建项目
	async createProject(params: ProjectDto.CreateProjectDto, uid: number) {
		try {
			if (params.tag.length < 1) {
				throw new HttpException('所属标签最少需要一个', HttpStatus.BAD_REQUEST)
			}

			const user = await this.userModel.findOne({ where: { uid } })
			const tag = await this.tagModel
				.createQueryBuilder('tag')
				.where('tag.id IN (:id)', { id: params.tag })
				.getMany()

			const project = await this.projectModel.create({
				title: params.title,
				description: params.description,
				picUrl: params.picUrl,
				github: params.github,
				accessUrl: params.accessUrl || null,
				status: params.status
			})
			const { id } = await this.projectModel.save({ ...project, user, tag })
			const T = await this.findIdProject(id)

			//写入项目创建日志
			await this.logger.createProjectLogger(uid, T)

			return T
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//获取所有项目列表
	async findProjectAll(params: ProjectDto.FindProjectDto) {
		try {
			const { uid, status, createTime } = params
			const U = await this.utilsService.filter('user', 'user', [
				'id',
				'article',
				'project',
				'notes',
				'tag',
				'role',
				'auth'
			])
			const T = await this.utilsService.filter('tag', 'tag', ['sort', 'user', 'article', 'notes', 'project'])
			const A = await this.utilsService.filter('project', 'project', ['tag', 'user'])

			const QB = await this.projectModel
				.createQueryBuilder('project')
				.select([].concat(U, T, A))
				.leftJoin('project.user', 'user')
				.leftJoin('project.tag', 'tag')
				.orderBy({ 'project.sort': 'DESC', 'project.createTime': 'DESC' })

			//uid筛选
			if (uid !== undefined && uid !== null) {
				QB.where('user.uid = :uid', { uid: params.uid })
			}

			//时间范围筛选
			if (createTime !== undefined && createTime !== null && createTime !== '') {
				QB.andWhere('project.createTime BETWEEN :start AND :end', {
					start: params.createTime,
					end: day().toDate()
				})
			}

			//状态筛选
			if (status !== undefined && status !== null) {
				QB.andWhere('project.status = :status', { status: params.status })
			}

			return await QB.getMany()
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//获取项目详情
	async findIdProject(id: number) {
		const U = await this.utilsService.filter('user', 'user', [
			'id',
			'article',
			'project',
			'notes',
			'tag',
			'role',
			'auth'
		])
		const T = await this.utilsService.filter('tag', 'tag', ['sort', 'user', 'article', 'notes', 'project'])
		const A = await this.utilsService.filter('project', 'project', ['tag', 'user'])

		return await this.projectModel
			.createQueryBuilder('project')
			.select([].concat(U, T, A))
			.leftJoin('project.user', 'user')
			.leftJoin('project.tag', 'tag')
			.where('project.id = :id', { id })
			.getOne()
	}

	//修改项目
	async updateProject(params: ProjectDto.UpdateProjectDto, uid: number) {
		try {
			if (params.tag.length < 1) {
				throw new HttpException('所属标签最少需要一个', HttpStatus.BAD_REQUEST)
			}

			const user = await this.userModel.findOne({ where: { uid }, relations: ['role'] })
			const project = await this.projectModel.findOne({ where: { id: params.id }, relations: ['user', 'tag'] })

			if (!project) {
				throw new HttpException(`id: ${params.id} 错误`, HttpStatus.BAD_REQUEST)
			}

			if (project.user.uid !== uid) {
				if (user.role?.role_key !== 'paker') {
					throw new HttpException('无法更改他人项目', HttpStatus.BAD_REQUEST)
				}
			}

			//修改文章所属标签
			await this.projectModel
				.createQueryBuilder('project')
				.relation('tag')
				.of(project)
				.addAndRemove(
					params.tag,
					project.tag.map(k => k.id)
				)

			//更新文章内容
			await this.projectModel
				.createQueryBuilder('project')
				.update({
					title: params.title,
					description: params.description,
					picUrl: params.picUrl,
					github: params.github,
					accessUrl: params.accessUrl,
					status: params.status
				})
				.where('project.id = :id', { id: params.id })
				.execute()

			const T = await this.findIdProject(params.id)

			//写入项目修改日志
			await this.logger.updateProjectLogger(uid, T)

			return T
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//置顶项目权重
	async updateProjectSort(params: ProjectDto.ProjectIdDto, uid: number) {
		try {
			const project = await this.projectModel.findOne({ where: { id: params.id } })
			if (project) {
				const { sort } = await this.projectModel
					.createQueryBuilder('project')
					.select('MAX(project.sort)', 'sort')
					.getRawOne()

				await this.projectModel.update({ id: params.id }, { sort: sort + 1 })
				const T = await this.findIdProject(params.id)

				//写入项目权重更改日志
				await this.logger.sortProjectLogger(uid, T)

				return T
			}
			throw new HttpException(`id: ${params.id} 错误`, HttpStatus.BAD_REQUEST)
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//切换项目状态
	async cutoverProject(params: ProjectDto.ProjectIdDto, uid: number) {
		try {
			const project = await this.projectModel.findOne({ where: { id: params.id } })
			if (project) {
				await this.projectModel.update({ id: params.id }, { status: project.status ? 0 : 1 })
				const T = await this.findIdProject(params.id)

				//写入项目状态更改日志
				await this.logger.cutoverProjectLogger(uid, T)

				return T
			}
			throw new HttpException(`id: ${params.id} 错误`, HttpStatus.BAD_REQUEST)
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//删除项目
	async deleteProject(params: ProjectDto.ProjectIdDto, uid: number) {
		try {
			const project = await this.projectModel.findOne({ where: { id: params.id } })
			if (project) {
				const delProject = await this.projectModel.delete({ id: params.id })
				if (delProject.affected === 0) {
					throw new HttpException(`id: ${params.id} 错误`, HttpStatus.BAD_REQUEST)
				}

				//写入项目删除日志
				await this.logger.deleteProjectLogger(uid, project)

				return delProject
			}
			throw new HttpException(`id: ${params.id} 错误`, HttpStatus.BAD_REQUEST)
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
