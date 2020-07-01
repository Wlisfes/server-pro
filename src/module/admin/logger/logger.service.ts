import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { LoggerEntity } from '@/entity/logger.entity'
import { UserEntity } from '@/entity/user.entity'

@Injectable()
export class LoggerService {
	constructor(
		@InjectRepository(LoggerEntity) private readonly loggerModel: Repository<LoggerEntity>,
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>
	) {}

	//动态日志列表
	public async LoggerAll() {
		try {
			return await this.loggerModel.find({ relations: ['user'], order: { createTime: 'DESC' } })
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//创建登录日志
	public async createLoginLogger(uid: number) {
		try {
			const user = await this.userModel.findOne({ where: { uid } })
			const logger = await this.loggerModel.create({ context: `<a>已登录</a>` })
			return await this.loggerModel.save({ ...logger, user })
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
