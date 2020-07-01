import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProjectController } from '@/module/admin/project/project.controller'
import { ProjectService } from '@/module/admin/project/project.service'
import { UtilsService } from '@/common/utils/utils.service'
import { LoggerModule } from '@/module/admin/logger/logger.module'
import { UserEntity } from '@/entity/user.entity'
import { TagEntity } from '@/entity/tag.entity'
import { ProjectEntity } from '@/entity/project.entity'

@Module({
	imports: [LoggerModule, TypeOrmModule.forFeature([UserEntity, TagEntity, ProjectEntity])],
	controllers: [ProjectController],
	providers: [ProjectService, UtilsService]
})
export class ProjectModule {}
