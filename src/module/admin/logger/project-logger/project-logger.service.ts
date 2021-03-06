import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { LoggerEntity } from '@/entity/logger.entity'
import { UserEntity } from '@/entity/user.entity'

export const commonit = {
	createGitHub: (github: string) => {
		return `<a href="${github}" target="_blank">
            <i class="anticon anticon-github" style="font-size: 20px;margin: 0 8px;">
                <svg
                    viewBox="64 64 896 896" data-icon="github" width="1em" 
                    height="1em" fill="currentColor" aria-hidden="true" focusable="false"
                >
                    <path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 
                        946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 
                        726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 
                        5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 
                        48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 
                        70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 
                        2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 
                        212.9a127.5 127.5 0 0 1 38.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 
                        304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z"
                    ></path>
                </svg>
            </i>
        </a>`
	},
	statusTAG: (status: number) => {
		const active = status === 0
		return `<span class="ant-tag ${
			active ? 'ant-tag-pink' : 'ant-tag-green'
		}" style="cursor: pointer;margin-left: 8px;">${active ? '禁用' : '开放'}</span>`
	}
}

@Injectable()
export class ProjectLoggerService {
	constructor(
		@InjectRepository(LoggerEntity) private readonly loggerModel: Repository<LoggerEntity>,
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>
	) {}

	//项目创建日志
	public async createProjectLogger(uid: number, params: any, ipv4: string) {
		try {
			const I = commonit.createGitHub(params.github)
			const user = await this.userModel.findOne({ where: { uid } })
			const logger = await this.loggerModel.create({
				ipv4,
				commonid: params.id,
				content: '新增项目',
				context: `<a>${params.title}</a>${I}`
			})
			return await this.loggerModel.save({ ...logger, user })
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//项目权重修改日志
	public async sortProjectLogger(uid: number, params: any, ipv4: string) {
		try {
			const I = commonit.createGitHub(params.github)
			const user = await this.userModel.findOne({ where: { uid } })
			const logger = await this.loggerModel.create({
				ipv4,
				commonid: params.id,
				content: '修改项目',
				context: `<a>${params.title}</a><span style="margin-left: 8px;">
                            权重变更为 <a style="font-size: 16px;">${params.sort}</a></span>${I}
                        `
			})
			return await this.loggerModel.save({ ...logger, user })
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//项目修改日志
	public async updateProjectLogger(uid: number, params: any, ipv4: string) {
		try {
			const I = commonit.createGitHub(params.github)
			const user = await this.userModel.findOne({ where: { uid } })
			const logger = await this.loggerModel.create({
				ipv4,
				commonid: params.id,
				content: '修改项目',
				context: `<a>${params.title}</a>${I}`
			})
			return await this.loggerModel.save({ ...logger, user })
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//项目状态修改日志
	public async cutoverProjectLogger(uid: number, params: any, ipv4: string) {
		try {
			const R = commonit.statusTAG(params.status)
			const user = await this.userModel.findOne({ where: { uid } })
			const logger = await this.loggerModel.create({
				ipv4,
				commonid: params.id,
				content: '修改项目',
				context: `<a>${params.title}</a><span style="margin-left: 8px;">状态变更为</span>${R}`
			})
			return await this.loggerModel.save({ ...logger, user })
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//项目删除日志
	public async deleteProjectLogger(uid: number, params: any, ipv4: string) {
		try {
			const I = commonit.createGitHub(params.github)
			const user = await this.userModel.findOne({ where: { uid } })
			const logger = await this.loggerModel.create({
				ipv4,
				commonid: params.id,
				content: '删除项目',
				context: `<a>${params.title}</a>${I}`
			})
			return await this.loggerModel.save({ ...logger, user })
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
