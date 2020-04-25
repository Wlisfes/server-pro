import { Controller, Get, Post, Body, Put, Delete, Query } from '@nestjs/common'
import { RoleService } from './role.service'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { createRoleDto, deleteRoleDto, updateRoleDto, changeRoleDto } from './role.dto'

@Controller('api/role')
@ApiTags('角色模块')
export class RoleController {
	constructor(private readonly roleService: RoleService) {}

	@Get('all')
	@ApiOperation({ summary: '获取所有角色列表' })
	async findRoleAll() {
		return await this.roleService.findRoleAll()
	}

	@Post('create')
	@ApiOperation({ summary: '新增角色' })
	async createRole(@Body() body: createRoleDto) {
		return await this.roleService.createRole(body)
	}

	@Put('change')
	@ApiOperation({ summary: '切换角色状态' })
	async changeRole(@Body() body: changeRoleDto) {
		return await this.roleService.changeRole(body)
	}

	@Delete('delete')
	@ApiOperation({ summary: '删除角色' })
	async deleteAuth(@Query() query: deleteRoleDto) {
		return await this.roleService.deleteRole(query.id)
	}

	@Put('update')
	@ApiOperation({ summary: '修改角色' })
	async updateRole(@Body() body: updateRoleDto) {
		return await this.roleService.updateRole(body)
	}
}
