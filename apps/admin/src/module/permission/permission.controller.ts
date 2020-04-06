import { Controller, Get, Post, Body } from '@nestjs/common'
import { PermissionService } from './permission.service'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { CreateDto } from './permission.dto'

@Controller('api/permission')
@ApiTags('权限模块')
export class PermissionController {
	constructor(private readonly permissionService: PermissionService) {}

	@Post('create')
	@ApiOperation({ summary: '创建权限模块' })
	async create(@Body() body: CreateDto) {
		return this.permissionService.create(body)
	}

	@Get('all')
	@ApiOperation({ summary: '获取所有权限模块列表' })
	async findAll() {
		return await this.permissionService.findAll()
	}
}
