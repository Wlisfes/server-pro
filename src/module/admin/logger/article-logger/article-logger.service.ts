import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
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
export class ArticleLoggerService {
	constructor(
		@InjectRepository(LoggerEntity) private readonly loggerModel: Repository<LoggerEntity>,
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>
	) {}

	//文章创建日志
	public async createArticleLogger(uid: number, params: any, ipv4: string) {
		try {
			const user = await this.userModel.findOne({ where: { uid } })
			const logger = await this.loggerModel.create({
				ipv4,
				commonid: params.id,
				content: '发表文章',
				context: `<a>${params.title}</a>`
			})
			return await this.loggerModel.save({ ...logger, user })
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//文章权重修改日志
	public async sortArticleLogger(uid: number, params: any, ipv4: string) {
		try {
			const user = await this.userModel.findOne({ where: { uid } })
			const logger = await this.loggerModel.create({
				ipv4,
				commonid: params.id,
				content: '修改文章',
				context: `<a>${params.title}</a><span style="margin-left: 8px;">
                            权重变更为 <a style="font-size: 16px;">${params.sort}</a></span>
                        `
			})
			return await this.loggerModel.save({ ...logger, user })
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//文章修改日志
	public async updateArticleLogger(uid: number, params: any, ipv4: string) {
		try {
			const user = await this.userModel.findOne({ where: { uid } })
			const logger = await this.loggerModel.create({
				ipv4,
				commonid: params.id,
				content: '修改文章',
				context: `<a>${params.title}</a>`
			})
			return await this.loggerModel.save({ ...logger, user })
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//文章状态修改日志
	public async cutoverArticleLogger(uid: number, params: any, ipv4: string) {
		try {
			const R = commonit.statusTAG(params.status)
			const user = await this.userModel.findOne({ where: { uid } })
			const logger = await this.loggerModel.create({
				ipv4,
				commonid: params.id,
				content: '修改文章',
				context: `<a>${params.title}</a><span style="margin-left: 8px;">状态变更为</span>${R}`
			})
			return await this.loggerModel.save({ ...logger, user })
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//文章删除日志
	public async deleteArticleLogger(uid: number, params: any, ipv4: string) {
		try {
			const user = await this.userModel.findOne({ where: { uid } })
			const logger = await this.loggerModel.create({
				ipv4,
				commonid: params.id,
				content: '删除文章',
				context: `<a>${params.title}</a>`
			})
			return await this.loggerModel.save({ ...logger, user })
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
