import { Injectable, HttpException, HttpStatus, Ip } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { LoggerEntity } from '@/entity/logger.entity'
import { UserEntity } from '@/entity/user.entity'

export const commonit = {
	statusTAG: (status: number) => {
		const active = status === 0
		return `<span class="ant-tag ${
			active ? 'ant-tag-pink' : 'ant-tag-green'
		}" style="cursor: pointer;margin-left: 8px;">${active ? '禁用' : '开放'}</span>`
	}
}

@Injectable()
export class NotesLoggerService {
	constructor(
		@InjectRepository(LoggerEntity) private readonly loggerModel: Repository<LoggerEntity>,
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>
	) {}

	//笔记创建日志
	public async createNotesLogger(uid: number, params: any) {
		try {
			const user = await this.userModel.findOne({ where: { uid } })
			const logger = await this.loggerModel.create({
				commonid: params.id,
				content: '新增笔记',
				context: `<a>${params.title}</a>`
			})
			return await this.loggerModel.save({ ...logger, user })
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//笔记权重修改日志
	public async sortNotesLogger(uid: number, params: any) {
		try {
			const user = await this.userModel.findOne({ where: { uid } })
			const logger = await this.loggerModel.create({
				commonid: params.id,
				content: '修改笔记',
				context: `<a>${params.title}</a><span style="margin-left: 8px;">
                            权重变更为 <a style="font-size: 16px;">${params.sort}</a></span>
                        `
			})
			return await this.loggerModel.save({ ...logger, user })
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//笔记修改日志
	public async updateNotesLogger(uid: number, params: any) {
		try {
			const user = await this.userModel.findOne({ where: { uid } })
			const logger = await this.loggerModel.create({
				commonid: params.id,
				content: '修改笔记',
				context: `<a>${params.title}</a>`
			})
			return await this.loggerModel.save({ ...logger, user })
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//笔记状态修改日志
	public async cutoverNotesLogger(uid: number, params: any) {
		try {
			const R = commonit.statusTAG(params.status)
			const user = await this.userModel.findOne({ where: { uid } })
			const logger = await this.loggerModel.create({
				commonid: params.id,
				content: '修改笔记',
				context: `<a>${params.title}</a><span style="margin-left: 8px;">状态变更为</span>${R}`
			})
			return await this.loggerModel.save({ ...logger, user })
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//笔记删除日志
	public async deleteNotesLogger(uid: number, params: any) {
		try {
			const user = await this.userModel.findOne({ where: { uid } })
			const logger = await this.loggerModel.create({
				commonid: params.id,
				content: '删除笔记',
				context: `<a>${params.title}</a>`
			})
			return await this.loggerModel.save({ ...logger, user })
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
