import { Controller, Post, Body, Req } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { ArticleService } from '@/module/article/article.service'
import { AuthUser, AuthRole } from '@/guard/auth.guard'

@Controller('article')
@ApiTags('文章模块')
export class ArticleController {
	constructor(private readonly articleService: ArticleService) {}

	@ApiOperation({ summary: '创建文章' })
	@Post('create')
	@AuthUser(true)
	async createArticle(@Body() body, @Req() req: { user: { uid: number } }) {
		return await this.articleService.createArticle(body, req.user.uid)
	}
}
