import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TagEntity } from '@/entity/tag.entity'
import { UserEntity } from '@/entity/user.entity'
import { ArticleEntity } from '@/entity/article.entity'
import * as ArticleDto from '@/module/article/article.dto'

type key = 'tag' | 'user' | 'article'

@Injectable()
export class ArticleService {
	constructor(
		@InjectRepository(TagEntity) private readonly tagModel: Repository<TagEntity>,
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
		@InjectRepository(ArticleEntity) private readonly articleModel: Repository<ArticleEntity>
	) {}

	private filter(key: key, u: key) {
		const tag = ['id', 'name', 'color', 'status', 'createTime']
		const user = ['uid', 'username', 'nickname', 'avatar', 'email', 'mobile', 'status', 'createTime']
		const article = ['id', 'title', 'description', 'picUrl', 'content', 'text', 'reading', 'status']
		switch (key) {
			case 'tag':
				return tag.map(k => `${u}.${k}`)
			case 'user':
				return user.map(k => `${u}.${k}`)
			case 'article':
				return article.map(k => `${u}.${k}`)
		}
	}

	//获取文章详情
	async findIdArticle(id: number) {
		const U = this.filter('user', 'user')
		const T = this.filter('tag', 'tag')
		const A = this.filter('article', 'article')

		return await this.articleModel
			.createQueryBuilder('article')
			.select([].concat(U, T, A))
			.leftJoin('article.user', 'user')
			.leftJoin('article.tag', 'tag')
			.where('article.id = :id', { id })
			.getOne()
	}

	//创建文章
	async createArticle(params: ArticleDto.CreateArticleDto, uid: number) {
		try {
			if (params.tag.length < 1) {
				throw new HttpException('所属标签最少需要一个', HttpStatus.BAD_REQUEST)
			}

			const user = await this.userModel.findOne({ where: { uid } })
			const tag = await this.tagModel
				.createQueryBuilder('tag')
				.where('tag.id IN (:id)', { id: params.tag })
				.getMany()

			const article = await this.articleModel.create({
				title: params.title,
				description: params.description,
				picUrl: params.picUrl,
				content: params.content,
				text: params.text
			})
			const { id } = await this.articleModel.save({ ...article, user, tag })

			return await this.findIdArticle(id)
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//修改文章
	async updateArticle(params: ArticleDto.UpdateArticleDto, uid: number) {
		try {
			if (params.tag.length < 1) {
				throw new HttpException('所属标签最少需要一个', HttpStatus.BAD_REQUEST)
			}

			const user = await this.userModel.findOne({ where: { uid } })
			const article = await this.articleModel.findOne({ where: { id: params.id }, relations: ['user', 'tag'] })
			const tag = await this.tagModel
				.createQueryBuilder('tag')
				.where('tag.id IN (:id)', { id: params.tag })
				.getMany()

			if (!article) {
				throw new HttpException(`id: ${params.id} 错误`, HttpStatus.BAD_REQUEST)
			}

			if (article.user.uid !== uid) {
				if (user.role.role_key !== 'paker') {
					throw new HttpException('无法更改他人文章', HttpStatus.BAD_REQUEST)
				}
			}

			// await this.tagModel.createQueryBuilder('tag').delete().where('tag')
			//更新文章
			await this.articleModel
				.createQueryBuilder('article')
				.update({
					title: params.title,
					description: params.description,
					picUrl: params.picUrl,
					content: params.content,
					text: params.text,
					status: params.status,
					tag: null
				})
				.where('article.id = :id', { id: params.id })
				.execute()

			// article.tag = tag
			return await this.findIdArticle(params.id)

			// return await this.tagModel.find({ relations: ['article'] })
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
