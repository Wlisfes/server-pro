import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NotesController } from '@/module/admin/notes/notes.controller'
import { NotesService } from '@/module/admin/notes/notes.service'
import { UtilsService } from '@/common/utils/utils.service'
import { TagEntity } from '@/entity/tag.entity'
import { UserEntity } from '@/entity/user.entity'
import { NotesEntity } from '@/entity/notes.entity'

@Module({
	imports: [TypeOrmModule.forFeature([TagEntity, UserEntity, NotesEntity])],
	controllers: [NotesController],
	providers: [NotesService, UtilsService]
})
export class NotesModule {}
