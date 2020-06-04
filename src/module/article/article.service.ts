import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TagEntity } from '@/entity/tag.entity'
import { UserEntity } from '@/entity/user.entity'
import { ArticleEntity } from '@/entity/article.entity'

@Injectable()
export class ArticleService {
	constructor(
		@InjectRepository(TagEntity) private readonly tagModel: Repository<TagEntity>,
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
		@InjectRepository(ArticleEntity) private readonly articleModel: Repository<ArticleEntity>
	) {}

	//创建文章
	async createArticle(params: any, uid: number) {
		try {
			const user = await this.userModel.findOne({ where: { uid } })
			const tag = await this.tagModel
				.createQueryBuilder('tag')
				.where('tag.id IN (:id)', { id: [1] })
				.getMany()
			const article = await this.articleModel.create({
				name: '常用的Array操作api3'
			})
			const { id } = await this.articleModel.save({ ...article, user, tag })

			return await this.articleModel
				.createQueryBuilder('article')
				.select(['article.id', 'article.name', 'user.uid', 'tag.name'])
				.leftJoin('article.user', 'user')
				.leftJoin('article.tag', 'tag')
				.where('article.id = :id', { id })
				.getOne()
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
