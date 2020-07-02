import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UtilsService } from '@/common/utils/utils.service'
import { ArticleLoggerService } from '@/module/admin/logger/article-logger/article-logger.service'
import { TagEntity } from '@/entity/tag.entity'
import { UserEntity } from '@/entity/user.entity'
import { ArticleEntity } from '@/entity/article.entity'
import * as ArticleDto from '@/module/admin/article/article.dto'
import * as day from 'dayjs'

@Injectable()
export class ArticleService {
	constructor(
		private readonly utilsService: UtilsService,
		private readonly logger: ArticleLoggerService,
		@InjectRepository(TagEntity) private readonly tagModel: Repository<TagEntity>,
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
		@InjectRepository(ArticleEntity) private readonly articleModel: Repository<ArticleEntity>
	) {}

	//创建文章
	async createArticle(params: ArticleDto.CreateArticleDto, uid: number, ipv4: string) {
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
				html: params.html,
				status: params.status,
				themeName: params.themeName
			})
			const { id } = await this.articleModel.save({ ...article, user, tag })

			const T = await this.findIdArticle(id)

			//写入文章创建日志
			await this.logger.createArticleLogger(uid, T, ipv4)

			return T
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//获取所有文章列表
	async findArticleAll(params: ArticleDto.FindArticleDto) {
		const { uid, status, tag, createTime } = params

		const U = await this.utilsService.filter('user', 'user', ['article', 'project', 'notes', 'tag', 'role', 'auth'])
		const T = await this.utilsService.filter('tag', 'tag', ['sort', 'user', 'article', 'notes', 'project'])
		const A = await this.utilsService.filter('article', 'article', ['createTime', 'user', 'tag'])

		const QB = await this.articleModel
			.createQueryBuilder('article')
			.select([].concat(U, T, A))
			.leftJoin('article.user', 'user')
			.leftJoin('article.tag', 'tag')
			.orderBy({ 'article.sort': 'DESC', 'article.createTime': 'DESC' })

		//uid筛选
		if (uid !== undefined && uid !== null) {
			QB.where('user.uid = :uid', { uid: params.uid })
		}

		//时间范围筛选
		if (createTime !== undefined && createTime !== null && createTime !== '') {
			QB.andWhere('article.createTime BETWEEN :start AND :end', {
				start: params.createTime,
				end: day().toDate()
			})
		}

		//标签筛选
		if (tag !== undefined && tag !== null) {
			QB.andWhere('tag.id = :id', { id: params.tag })
		}

		//状态筛选
		if (status !== undefined && status !== null) {
			QB.andWhere('article.status = :status', { status: params.status })
		}

		const article = await QB.getMany()

		if (tag !== undefined && tag !== null && article.length > 0) {
			const QB = await this.articleModel
				.createQueryBuilder('article')
				.select([].concat(U, T, A))
				.leftJoin('article.user', 'user')
				.leftJoin('article.tag', 'tag')
				.orderBy({ 'article.sort': 'DESC', 'article.createTime': 'DESC' })
				.where('article.id IN (:id)', { id: article.map(k => k.id) })
				.getMany()
		}

		return article
	}

	//获取文章详情
	async findIdArticle(id: number) {
		const U = await this.utilsService.filter('user', 'user', ['article', 'project', 'notes', 'tag', 'role', 'auth'])
		const T = await this.utilsService.filter('tag', 'tag', ['sort', 'user', 'article', 'notes', 'project'])
		const A = await this.utilsService.filter('article', 'article', ['createTime', 'user', 'tag'])

		return await this.articleModel
			.createQueryBuilder('article')
			.select([].concat(U, T, A))
			.leftJoin('article.user', 'user')
			.leftJoin('article.tag', 'tag')
			.where('article.id = :id', { id })
			.getOne()
	}

	//修改文章
	async updateArticle(params: ArticleDto.UpdateArticleDto, uid: number, ipv4: string) {
		try {
			if (params.tag.length < 1) {
				throw new HttpException('所属标签最少需要一个', HttpStatus.BAD_REQUEST)
			}

			const user = await this.userModel.findOne({ where: { uid }, relations: ['role'] })
			const article = await this.articleModel.findOne({ where: { id: params.id }, relations: ['user', 'tag'] })

			if (!article) {
				throw new HttpException(`id: ${params.id} 错误`, HttpStatus.BAD_REQUEST)
			}

			if (article.user.uid !== uid) {
				if (user.role.role_key !== 'admin') {
					throw new HttpException('无法更改他人文章', HttpStatus.BAD_REQUEST)
				}
			}

			//修改文章所属标签
			await this.articleModel
				.createQueryBuilder('article')
				.relation('tag')
				.of(article)
				.addAndRemove(
					params.tag,
					article.tag.map(k => k.id)
				)

			//更新文章内容
			await this.articleModel
				.createQueryBuilder('article')
				.update({
					title: params.title,
					description: params.description,
					picUrl: params.picUrl,
					content: params.content,
					html: params.html,
					status: params.status,
					themeName: params.themeName
				})
				.where('article.id = :id', { id: params.id })
				.execute()

			const T = await this.findIdArticle(params.id)

			//写入文章更改日志
			await this.logger.updateArticleLogger(uid, T, ipv4)

			return T
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//置顶标签权重
	async updateArticleSort(params: ArticleDto.ArticleIdDto, uid: number, ipv4: string) {
		try {
			const article = await this.articleModel.findOne({ where: { id: params.id } })
			if (article) {
				const { sort } = await this.articleModel
					.createQueryBuilder('article')
					.select('MAX(article.sort)', 'sort')
					.getRawOne()

				await this.articleModel.update({ id: params.id }, { sort: sort + 1 })
				const T = await this.findIdArticle(params.id)

				//写入文章权重更改日志
				await this.logger.sortArticleLogger(uid, T, ipv4)

				return T
			}
			throw new HttpException(`id: ${params.id} 错误`, HttpStatus.BAD_REQUEST)
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//切换文章状态
	async cutoverArticle(params: ArticleDto.ArticleIdDto, uid: number, ipv4: string) {
		try {
			const article = await this.articleModel.findOne({ where: { id: params.id } })
			if (article) {
				await this.articleModel.update({ id: params.id }, { status: article.status ? 0 : 1 })
				const T = await this.findIdArticle(params.id)

				//写入文章状态更改日志
				await this.logger.cutoverArticleLogger(uid, T, ipv4)

				return T
			}
			throw new HttpException(`id: ${params.id} 错误`, HttpStatus.BAD_REQUEST)
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//删除文章
	async deleteArticle(params: ArticleDto.ArticleIdDto, uid: number, ipv4: string) {
		try {
			const article = await this.articleModel.findOne({ where: { id: params.id } })
			if (article) {
				const delArticle = await this.articleModel.delete({ id: params.id })
				if (delArticle.affected === 0) {
					throw new HttpException(`id: ${params.id} 错误`, HttpStatus.BAD_REQUEST)
				}

				//写入文章删除日志
				await this.logger.deleteArticleLogger(uid, article, ipv4)

				return delArticle
			}
			throw new HttpException(`id: ${params.id} 错误`, HttpStatus.BAD_REQUEST)
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
