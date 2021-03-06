import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LoggerService } from '@/module/admin/logger/logger.service'
import { UtilsService } from '@/common/utils/utils.service'
import { LoggerController } from '@/module/admin/logger/logger.controller'
import { LoggerEntity } from '@/entity/logger.entity'
import { UserEntity } from '@/entity/user.entity'
import { TagLoggerService } from '@/module/admin/logger/tag-logger/tag-logger.service'
import { UserLoggerService } from '@/module/admin/logger/user-logger/user-logger.service'
import { ProjectLoggerService } from '@/module/admin/logger/project-logger/project-logger.service'
import { ArticleLoggerService } from '@/module/admin/logger/article-logger/article-logger.service'
import { NotesLoggerService } from '@/module/admin/logger/notes-logger/notes-logger.service'

@Module({
	imports: [TypeOrmModule.forFeature([LoggerEntity, UserEntity])],
	providers: [
		LoggerService,
		TagLoggerService,
		UserLoggerService,
		ProjectLoggerService,
		ArticleLoggerService,
		NotesLoggerService,
		UtilsService
	],
	controllers: [LoggerController],
	exports: [
		LoggerService,
		TagLoggerService,
		UserLoggerService,
		ProjectLoggerService,
		ArticleLoggerService,
		NotesLoggerService
	]
})
export class LoggerModule {}
