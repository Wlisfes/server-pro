import { Controller, Post, Put, Delete, Get, Body, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { RoleService } from './role.service'
import { CreateRoleDto, UpdateRoleDto, DeleteRoleDto, CutoverRoleDto } from './role.dto'

@Controller('api/role')
@ApiTags('角色模块')
export class RoleController {
	constructor(private readonly roleService: RoleService) {}

	@Post('create')
	@ApiOperation({ summary: '创建角色' })
	async createRole(@Body() body: CreateRoleDto) {
		return await this.roleService.createRole(body)
	}

	@Get('all')
	@ApiOperation({ summary: '获取所有角色列表' })
	async findRoleAll() {
		return await this.roleService.findRoleAll()
	}

	@Put('update')
	@ApiOperation({ summary: '修改角色' })
	async updateRole(@Body() body: UpdateRoleDto) {
		return await this.roleService.updateRole(body)
	}

	@ApiOperation({ summary: '切换权限状态' })
	@Put('cutover')
	async cutoverRole(@Query() query: CutoverRoleDto) {
		return await this.roleService.cutoverRole(query)
	}

	@Delete('delete')
	@ApiOperation({ summary: '删除角色' })
	async deleteRole(@Query() body: DeleteRoleDto) {
		return await this.roleService.deleteRole(body)
	}
}
