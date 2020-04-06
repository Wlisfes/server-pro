import { Controller, Get, Post, Body } from '@nestjs/common'
import { RoleService } from './role.service'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { CreateDto } from './role.dto'

@Controller('api/role')
@ApiTags('角色模块')
export class RoleController {
	constructor(private readonly roleService: RoleService) {}

	@Post('create')
	@ApiOperation({ summary: '创建角色' })
	async create(@Body() body: CreateDto) {
		return await this.roleService.create(body)
	}

	@Get('all')
	@ApiOperation({ summary: '获取所有角色列表' })
	async findAll() {
		return await this.roleService.findAll()
	}
}
