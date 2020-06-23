import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UtilsService } from '@/common/utils/utils.service'
import { TagEntity } from '@/entity/tag.entity'
import { UserEntity } from '@/entity/user.entity'
import { NotesEntity } from '@/entity/notes.entity'

@Injectable()
export class NotesService {
	constructor(
		private readonly utilsService: UtilsService,
		@InjectRepository(TagEntity) private readonly tagModel: Repository<TagEntity>,
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
		@InjectRepository(NotesEntity) private readonly notesModel: Repository<NotesEntity>
	) {}

	//获取所有笔记
	public async findNotesAll() {
		return await this.utilsService.filter('user', 'user', ['id', 'uid'])
	}
}
