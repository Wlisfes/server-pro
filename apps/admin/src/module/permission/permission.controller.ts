import { Controller, Get, Post, Body, Delete, Query } from '@nestjs/common'
import { PermissionService } from './permission.service'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { CreateDto, DeletePermissionDto } from './permission.dto'

@Controller('api/permission')
@ApiTags('权限模块')
export class PermissionController {
	constructor(private readonly permissionService: PermissionService) {}

	@Get('apply/all')
	@ApiOperation({ summary: '获取所有操作类型' })
	async applyfindAll() {
		return await this.permissionService.applyFindAll()
	}

	@Post('create')
	@ApiOperation({ summary: '创建权限模块' })
	async create(@Body() body) {
		return this.permissionService.create(body)
	}

	@Get('all')
	@ApiOperation({ summary: '获取所有权限模块列表' })
	async findAll() {
		return await this.permissionService.findAll()
	}

	@Delete('delete')
	@ApiOperation({ summary: '删除权限模块' })
	async delete(@Query() query: DeletePermissionDto) {
		return await this.permissionService.delete(query.id)
	}
}
