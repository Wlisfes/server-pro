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
	async createArticle(@Body() body: ArticleDto.CreateArticleDto, @Req() req: { user: { uid: number } }) {
		return await this.articleService.createArticle(body, req.user.uid)
	}

	@ApiOperation({ summary: '获取所有文章列表' })
	@Get('all')
	@AuthUser(true)
	async findArticleAll(@Query() query: ArticleDto.FindArticleDto) {
		return await this.articleService.findArticleAll(query)
	}

	@ApiOperation({ summary: '获取文章详情' })
	@Get('info')
	@AuthUser(true)
	async findIdArticle(@Query() query: ArticleDto.ArticleIdDto) {
		return await this.articleService.findIdArticle(query.id)
	}

	@ApiOperation({ summary: '修改文章' })
	@Put('update')
	@AuthUser(true)
	async updateArticle(@Body() body: ArticleDto.UpdateArticleDto, @Req() req: { user: { uid: number } }) {
		return await this.articleService.updateArticle(body, req.user.uid)
	}

	@ApiOperation({ summary: '置顶文章权重' })
	@Put('sort')
	async updateArticleSort(@Query() query: ArticleDto.ArticleIdDto) {
		return await this.articleService.updateArticleSort(query)
	}

	@ApiOperation({ summary: '切换文章状态' })
	@Put('cutover')
	async cutoverArticle(@Query() query: ArticleDto.ArticleIdDto) {
		return await this.articleService.cutoverArticle(query)
	}

	@ApiOperation({ summary: '删除文章' })
	@Delete('delete')
	async deleteArticle(@Query() query: ArticleDto.ArticleIdDto) {
		return await this.articleService.deleteArticle(query)
	}
}
