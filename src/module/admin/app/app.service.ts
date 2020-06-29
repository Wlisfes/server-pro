import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TagEntity } from '@/entity/tag.entity'
import { ArticleEntity } from '@/entity/article.entity'
import { ProjectEntity } from '@/entity/project.entity'
import { NotesEntity } from '@/entity/notes.entity'
import { UserEntity } from '@/entity/user.entity'

@Injectable()
export class AppService {
	constructor(
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
		@InjectRepository(TagEntity) private readonly tagModel: Repository<TagEntity>,
		@InjectRepository(ArticleEntity) private readonly articleModel: Repository<ArticleEntity>,
		@InjectRepository(ProjectEntity) private readonly projectModel: Repository<ProjectEntity>,
		@InjectRepository(NotesEntity) private readonly notesModel: Repository<NotesEntity>
	) {}

	//信息统计
	public async AppCount() {
		try {
			const user = await this.userModel.find()
			const tag = await this.tagModel.find()
			const project = await this.projectModel.find()
			const notes = await this.notesModel.find()
			const article = await this.articleModel.find()

			return {
				user: user.length,
				tag: tag.length,
				project: project.length,
				notes: notes.length,
				article: article.length
			}
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
