import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { LoggerEntity } from '@/entity/logger.entity'
import { UserEntity } from '@/entity/user.entity'

export const commonit = {
	createTAG: (name: string, color: string) => {
		return `<span class="ant-tag ant-tag-has-color" 
        style="background-color: ${color}; cursor: pointer;"
        >${name}</span>`
	},
	statusTAG: (status: number) => {
		const active = status === 0
		return `<span class="ant-tag ${
			active ? 'ant-tag-pink' : 'ant-tag-green'
		}" style="cursor: pointer;margin-left: 8px;">${active ? '禁用' : '开放'}</span>`
	}
}

@Injectable()
export class TagLoggerService {
	constructor(
		@InjectRepository(LoggerEntity) private readonly loggerModel: Repository<LoggerEntity>,
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>
	) {}

	//标签创建日志
	public async createTAGLogger(uid: number, params: any) {
		try {
			const T = commonit.createTAG(params.name, params.color)
			const user = await this.userModel.findOne({ where: { uid } })
			const logger = await this.loggerModel.create({
				content: '新增',
				context: `${T}<span>标签</span>`
			})
			return await this.loggerModel.save({ ...logger, user })
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//标签权重修改日志
	public async sortTAGLogger(uid: number, params: any) {
		try {
			const T = commonit.createTAG(params.name, params.color)
			const user = await this.userModel.findOne({ where: { uid } })
			const logger = await this.loggerModel.create({
				content: '修改',
				context: `${T}<span>标签权重为 <a style="font-size: 16px;">${params.sort}</a></span>`
			})
			return await this.loggerModel.save({ ...logger, user })
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	///标签状态修改日志
	public async cutoverTAGLogger(uid: number, params: any) {
		try {
			const T = commonit.createTAG(params.name, params.color)
			const R = commonit.statusTAG(params.status)
			const user = await this.userModel.findOne({ where: { uid } })
			const logger = await this.loggerModel.create({
				content: '修改',
				context: `${T}<span>标签状态为</span>${R}`
			})
			return await this.loggerModel.save({ ...logger, user })
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//标签信息修改日志
	public async updateTAGLogger(uid: number, params: any, Old: any) {
		try {
			const T = commonit.createTAG(params.name, params.color)
			const R = commonit.createTAG(Old.name, Old.color)
			const user = await this.userModel.findOne({ where: { uid } })
			const logger = await this.loggerModel.create({
				content: '修改',
				context: `${T}<span style="margin-right: 8px;">标签状态为</span>${R}<span>标签</span>`
			})
			return await this.loggerModel.save({ ...logger, user })
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//标签删除日志
	public async deleteTAGLogger(uid: number, params: any) {
		try {
			const T = commonit.createTAG(params.name, params.color)
			const user = await this.userModel.findOne({ where: { uid } })
			const logger = await this.loggerModel.create({
				content: '删除',
				context: `${T}<span>标签</span>`
			})
			return await this.loggerModel.save({ ...logger, user })
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
