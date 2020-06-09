import { Controller, Post, Put, Delete, Get, Body, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { RoleService } from './role.service'
import { RoleId, CreateRoleDto, UpdateRoleDto, DeleteRoleDto, CutoverRoleDto } from './role.dto'
import { AuthUser, AuthRole } from '@/guard/auth.guard'

const path = `${process.env.ADMINPREFIX}/role`

@Controller(path)
@ApiTags('角色模块')
export class RoleController {
	constructor(private readonly roleService: RoleService) {}

	@Post('create')
	@ApiOperation({ summary: '创建角色' })
	@AuthUser(true)
	@AuthRole({ key: 'role', apply: 'create' })
	async createRole(@Body() body: CreateRoleDto) {
		return await this.roleService.createRole(body)
	}

	@Get('all')
	@ApiOperation({ summary: '获取所有角色列表' })
	@AuthUser(true)
	@AuthRole({ key: 'role', apply: 'query' })
	async findRoleAll() {
		return await this.roleService.findRoleAll()
	}

	@Get('info')
	@ApiOperation({ summary: '获取角色详情' })
	@AuthUser(true)
	@AuthRole({ key: 'role', apply: 'get' })
	async findIdRole(@Query() query: RoleId) {
		return await this.roleService.findIdRole(query)
	}

	@Put('update')
	@ApiOperation({ summary: '修改角色' })
	@AuthUser(true)
	@AuthRole({ key: 'role', apply: 'update' })
	async updateRole(@Body() body: UpdateRoleDto) {
		return await this.roleService.updateRole(body)
	}

	@ApiOperation({ summary: '切换权限状态' })
	@Put('cutover')
	@AuthUser(true)
	@AuthRole({ key: 'role', apply: 'update' })
	async cutoverRole(@Query() query: CutoverRoleDto) {
		return await this.roleService.cutoverRole(query)
	}

	@Delete('delete')
	@AuthUser(true)
	@AuthRole({ key: 'role', apply: 'delete' })
	@ApiOperation({ summary: '删除角色' })
	async deleteRole(@Query() body: DeleteRoleDto) {
		return await this.roleService.deleteRole(body)
	}
}