import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UtilsService } from '@/common/utils/utils.service'
import { Repository } from 'typeorm'
import { LoggerEntity } from '@/entity/logger.entity'
import { UserEntity } from '@/entity/user.entity'

@Injectable()
export class LoggerService {
	constructor(
		private readonly utilsService: UtilsService,
		@InjectRepository(LoggerEntity) private readonly loggerModel: Repository<LoggerEntity>,
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>
	) {}

	//获取动态日志列表
	public async LoggerAll(limit: number, offset: number) {
		try {
			const U = await this.utilsService.filter('user', 'user', [
				'article',
				'project',
				'notes',
				'tag',
				'role',
				'auth'
			])
			const L = await this.utilsService.filter('logger', 'logger')
			const len = await (await this.loggerModel.find({ select: ['id'] })).length
			const logger = await this.loggerModel
				.createQueryBuilder('logger')
				.select([].concat(L, U))
				.leftJoin('logger.user', 'user')
				.orderBy({ 'logger.createTime': 'DESC' })
				.skip(offset)
				.take(limit)
				.getMany()

			return { len, logger }
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
