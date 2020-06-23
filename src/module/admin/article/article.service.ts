import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UtilsService } from '@/common/utils/utils.service'
import { TagEntity } from '@/entity/tag.entity'
import { UserEntity } from '@/entity/user.entity'
import { ArticleEntity } from '@/entity/article.entity'
import * as ArticleDto from '@/module/admin/article/article.dto'
import * as day from 'dayjs'

@Injectable()
export class ArticleService {
	constructor(
		private readonly utilsService: UtilsService,
		@InjectRepository(TagEntity) private readonly tagModel: Repository<TagEntity>,
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
		@InjectRepository(ArticleEntity) private readonly articleModel: Repository<ArticleEntity>
	) {}

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
				html: params.html,
				status: params.status,
				themeName: params.themeName
			})
			const { id } = await this.articleModel.save({ ...article, user, tag })

			return await this.findIdArticle(id)
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//获取所有文章列表
	async findArticleAll(params: ArticleDto.FindArticleDto) {
		const { uid, status, createTime } = params

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

		//状态筛选
		if (status !== undefined && status !== null) {
			QB.andWhere('article.status = :status', { status: params.status })
		}

		return await QB.getMany()
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
	async updateArticle(params: ArticleDto.UpdateArticleDto, uid: number) {
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

			return await this.findIdArticle(params.id)
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//置顶标签权重
	async updateArticleSort(params: ArticleDto.ArticleIdDto) {
		try {
			const article = await this.articleModel.findOne({ where: { id: params.id } })
			if (article) {
				const { sort } = await this.articleModel
					.createQueryBuilder('article')
					.select('MAX(article.sort)', 'sort')
					.getRawOne()

				await this.articleModel.update({ id: params.id }, { sort: sort + 1 })
				return await this.findIdArticle(params.id)
			}
			throw new HttpException(`id: ${params.id} 错误`, HttpStatus.BAD_REQUEST)
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//切换文章状态
	async cutoverArticle(params: ArticleDto.ArticleIdDto) {
		try {
			const article = await this.articleModel.findOne({ where: { id: params.id } })
			if (article) {
				await this.articleModel.update({ id: params.id }, { status: article.status ? 0 : 1 })
				return await this.findIdArticle(params.id)
			}
			throw new HttpException(`id: ${params.id} 错误`, HttpStatus.BAD_REQUEST)
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//删除文章
	async deleteArticle(params: ArticleDto.ArticleIdDto) {
		try {
			const article = await this.articleModel.findOne({ where: { id: params.id } })
			if (article) {
				const delArticle = await this.articleModel.delete({ id: params.id })
				if (delArticle.affected === 0) {
					throw new HttpException(`id: ${params.id} 错误`, HttpStatus.BAD_REQUEST)
				}
				return delArticle
			}
			throw new HttpException(`id: ${params.id} 错误`, HttpStatus.BAD_REQUEST)
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
