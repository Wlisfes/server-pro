import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { LoggerEntity } from '@/entity/logger.entity'
import { UserEntity } from '@/entity/user.entity'

@Injectable()
export class UserLoggerService {
	constructor(
		@InjectRepository(LoggerEntity) private readonly loggerModel: Repository<LoggerEntity>,
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>
	) {}

	//登录日志
	public async loginLogger(uid: number, ipv4: string) {
		try {
			const user = await this.userModel.findOne({ where: { uid } })
			const logger = await this.loggerModel.create({
				ipv4,
				commonid: uid,
				context: `<a>已登录</a>`
			})
			return await this.loggerModel.save({ ...logger, user })
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
