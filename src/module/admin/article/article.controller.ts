import { Controller, Post, Put, Get, Body, Delete, Query, Req } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { ArticleService } from '@/module/admin/article/article.service'
import { AuthUser, AuthRole } from '@/guard/auth.guard'
import * as ArticleDto from '@/module/admin/article/article.dto'

const path = `${process.env.ADMINPREFIX}/article`

@Controller(path)
@ApiTags('文章模块')
export class ArticleController {
	constructor(private readonly articleService: ArticleService) {}

	@ApiOperation({ summary: '创建文章' })
	@Post('create')
	@AuthUser(true)
	@AuthRole({ key: 'article', apply: 'create' })
	async createArticle(
		@Body() body: ArticleDto.CreateArticleDto,
		@Req() req: { ipv4: string; user: { uid: number } }
	) {
		return await this.articleService.createArticle(body, req.user.uid, req.ipv4)
	}

	@ApiOperation({ summary: '获取所有文章列表' })
	@Get('all')
	@AuthUser(true)
	@AuthRole({ key: 'article', apply: 'query' })
	async findArticleAll(@Query() query: ArticleDto.FindArticleDto) {
		return await this.articleService.findArticleAll(query)
	}

	@ApiOperation({ summary: '获取文章详情' })
	@Get('info')
	@AuthUser(true)
	@AuthRole({ key: 'article', apply: 'get' })
	async findIdArticle(@Query() query: ArticleDto.ArticleIdDto) {
		return await this.articleService.findIdArticle(query.id)
	}

	@ApiOperation({ summary: '修改文章' })
	@Put('update')
	@AuthUser(true)
	@AuthRole({ key: 'article', apply: 'update' })
	async updateArticle(
		@Body() body: ArticleDto.UpdateArticleDto,
		@Req() req: { ipv4: string; user: { uid: number } }
	) {
		return await this.articleService.updateArticle(body, req.user.uid, req.ipv4)
	}

	@ApiOperation({ summary: '置顶文章权重' })
	@Put('sort')
	@AuthUser(true)
	@AuthRole({ key: 'article', apply: 'update' })
	async updateArticleSort(
		@Query() query: ArticleDto.ArticleIdDto,
		@Req() req: { ipv4: string; user: { uid: number } }
	) {
		return await this.articleService.updateArticleSort(query, req.user.uid, req.ipv4)
	}

	@ApiOperation({ summary: '切换文章状态' })
	@Put('cutover')
	@AuthUser(true)
	@AuthRole({ key: 'article', apply: 'update' })
	async cutoverArticle(@Query() query: ArticleDto.ArticleIdDto, @Req() req: { ipv4: string; user: { uid: number } }) {
		return await this.articleService.cutoverArticle(query, req.user.uid, req.ipv4)
	}

	@ApiOperation({ summary: '删除文章' })
	@Delete('delete')
	@AuthUser(true)
	@AuthRole({ key: 'article', apply: 'delete' })
	async deleteArticle(@Query() query: ArticleDto.ArticleIdDto, @Req() req: { ipv4: string; user: { uid: number } }) {
		return await this.articleService.deleteArticle(query, req.user.uid, req.ipv4)
	}
}
