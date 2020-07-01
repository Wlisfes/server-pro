import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LoggerService } from '@/module/admin/logger/logger.service'
import { LoggerController } from '@/module/admin/logger/logger.controller'
import { LoggerEntity } from '@/entity/logger.entity'
import { UserEntity } from '@/entity/user.entity'

@Module({
	imports: [TypeOrmModule.forFeature([LoggerEntity, UserEntity])],
	providers: [LoggerService],
	controllers: [LoggerController],
	exports: [LoggerService]
})
export class LoggerModule {}
