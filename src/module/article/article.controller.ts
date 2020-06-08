import { Controller, Post, Put, Body, Req } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { ArticleService } from '@/module/article/article.service'
import { AuthUser, AuthRole } from '@/guard/auth.guard'

import * as ArticleDto from '@/module/article/article.dto'

@Controller('api/article')
@ApiTags('文章模块')
export class ArticleController {
	constructor(private readonly articleService: ArticleService) {}

	@ApiOperation({ summary: '创建文章' })
	@Post('create')
	@AuthUser(true)
	async createArticle(@Body() body: ArticleDto.CreateArticleDto, @Req() req: { user: { uid: number } }) {
		return await this.articleService.createArticle(body, req.user.uid)
	}

	@ApiOperation({ summary: '修改文章' })
	@Put('update')
	@AuthUser(true)
	async updateArticle(@Body() body: ArticleDto.UpdateArticleDto, @Req() req: { user: { uid: number } }) {
		return await this.articleService.updateArticle(body, req.user.uid)
	}
}
