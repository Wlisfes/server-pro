import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TagEntity } from '@/entity/tag.entity'
import { UserEntity } from '@/entity/user.entity'
import { ProjectEntity } from '@/entity/project.entity'
import * as ProjectDto from '@/module/admin/project/project.dto'
import * as day from 'dayjs'

type key = 'tag' | 'user' | 'project'

@Injectable()
export class ProjectService {
	constructor(
		@InjectRepository(TagEntity) private readonly tagModel: Repository<TagEntity>,
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
		@InjectRepository(ProjectEntity) private readonly projectModel: Repository<ProjectEntity>
	) {}

	private filter(key: key, u: key) {
		const tag = ['id', 'name', 'color', 'status', 'createTime']
		const user = ['uid', 'username', 'nickname', 'avatar', 'email', 'mobile', 'status', 'createTime']
		const project = ['id', 'title', 'description', 'picUrl', 'sort', 'status', 'like', 'github', 'accessUrl']
		switch (key) {
			case 'tag':
				return tag.map(k => `${u}.${k}`)
			case 'user':
				return user.map(k => `${u}.${k}`)
			case 'project':
				return project.map(k => `${u}.${k}`)
		}
	}

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
				accessUrl: params.accessUrl
			})
			const { id } = await this.projectModel.save({ ...project, user, tag })

			return await this.findIdProject(id)
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//获取项目详情
	async findIdProject(id: number) {
		const U = this.filter('user', 'user')
		const T = this.filter('tag', 'tag')
		const A = this.filter('project', 'project')

		return await this.projectModel
			.createQueryBuilder('project')
			.select([].concat(U, T, A))
			.leftJoin('project.user', 'user')
			.leftJoin('project.tag', 'tag')
			.where('project.id = :id', { id })
			.getOne()
	}
}
