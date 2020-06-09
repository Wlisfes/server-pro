import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProjectController } from '@/module/admin/project/project.controller'
import { ProjectService } from '@/module/admin/project/project.service'
import { UserEntity } from '@/entity/user.entity'
import { TagEntity } from '@/entity/tag.entity'
import { ProjectEntity } from '@/entity/project.entity'

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, TagEntity, ProjectEntity])],
	controllers: [ProjectController],
	providers: [ProjectService]
})
export class ProjectModule {}
