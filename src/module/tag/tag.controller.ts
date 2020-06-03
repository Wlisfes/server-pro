import { Controller, Post, Get, Put, Delete, Body, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { TagService } from '@/module/tag/tag.service'

@Controller('tag')
@ApiTags('标签模块')
export class TagController {
	constructor(private readonly tagService: TagService) {}

	@ApiOperation({ summary: '创建标签' })
	@Post('create')
	async createTag(@Body() body) {
		return body
	}

	@ApiOperation({ summary: '获取所有标签列表' })
	@Get('all')
	async findTagAll() {
		return []
	}

	@ApiOperation({ summary: '获取标签详情' })
	@Get('info')
	async findIdTag(@Query() query) {
		return query
	}

	@ApiOperation({ summary: '修改标签信息' })
	@Put('update')
	async updateTag(@Body() body) {
		return body
	}

	@ApiOperation({ summary: '置顶标签权重' })
	@Put('sort')
	async updateTagSort(@Query() query) {
		return query
	}

	@ApiOperation({ summary: '切换标签状态' })
	@Put('cutover')
	async cutoverTag(@Query() query) {
		return query
	}

	@ApiOperation({ summary: '删除标签' })
	@Delete('delete')
	async deleteTag(@Query() query) {
		return query
	}
}
