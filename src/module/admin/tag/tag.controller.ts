import { Controller, Post, Get, Put, Delete, Body, Query, Req } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { TagService } from '@/module/admin/tag/tag.service'
import { AuthUser, AuthRole } from '@/guard/auth.guard'
import * as TagDto from '@/module/admin/tag/tag.dto'

const path = `${process.env.ADMINPREFIX}/tag`

@Controller(path)
@ApiTags('标签模块')
export class TagController {
	constructor(private readonly tagService: TagService) {}

	@ApiOperation({ summary: '创建标签' })
	@Post('create')
	@AuthUser(true)
	@AuthRole({ key: 'tag', apply: 'create' })
	async createTag(@Body() body: TagDto.CreateTagDto, @Req() req: { user: { uid: number } }) {
		return await this.tagService.createTag(body, req.user.uid)
	}

	@ApiOperation({ summary: '获取所有标签列表' })
	@Get('all')
	@AuthRole({ key: 'tag', apply: 'query' })
	async findTagAll(@Query() query: TagDto.FindTagDto) {
		return await this.tagService.findTagAll(query)
	}

	@ApiOperation({ summary: '获取标签详情' })
	@Get('info')
	@AuthRole({ key: 'tag', apply: 'get' })
	async findIdTag(@Query() query: TagDto.TagId) {
		return await this.tagService.findIdTag(query)
	}

	@ApiOperation({ summary: '修改标签信息' })
	@Put('update')
	@AuthUser(true)
	@AuthRole({ key: 'tag', apply: 'update' })
	async updateTag(@Body() body: TagDto.UpdateTagDto, @Req() req: { user: { uid: number } }) {
		return await this.tagService.updateTag(body, req.user.uid)
	}

	@ApiOperation({ summary: '置顶标签权重' })
	@Put('sort')
	@AuthUser(true)
	@AuthRole({ key: 'tag', apply: 'update' })
	async updateTagSort(@Query() query: TagDto.TagId, @Req() req: { user: { uid: number } }) {
		return await this.tagService.updateTagSort(query, req.user.uid)
	}

	@ApiOperation({ summary: '切换标签状态' })
	@Put('cutover')
	@AuthUser(true)
	@AuthRole({ key: 'tag', apply: 'update' })
	async cutoverTag(@Query() query: TagDto.TagId, @Req() req: { user: { uid: number } }) {
		return await this.tagService.cutoverTag(query, req.user.uid)
	}

	@ApiOperation({ summary: '删除标签' })
	@Delete('delete')
	@AuthUser(true)
	@AuthRole({ key: 'tag', apply: 'delete' })
	async deleteTag(@Query() query: TagDto.TagId, @Req() req: { user: { uid: number } }) {
		return await this.tagService.deleteTag(query, req.user.uid)
	}
}
