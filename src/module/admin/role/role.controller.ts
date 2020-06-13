import { Controller, Post, Put, Delete, Get, Body, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { RoleService } from './role.service'
import { AuthUser, AuthRole } from '@/guard/auth.guard'
import * as RoleIdDto from '@/module/admin/role/role.dto'

const path = `${process.env.ADMINPREFIX}/role`

@Controller(path)
@ApiTags('角色模块')
export class RoleController {
	constructor(private readonly roleService: RoleService) {}

	@Post('create')
	@ApiOperation({ summary: '创建角色' })
	// @AuthUser(true)
	// @AuthRole({ key: 'role', apply: 'create' })
	async createRole(@Body() body: RoleIdDto.CreateRoleDto) {
		return await this.roleService.createRole(body)
	}

	@Get('all')
	@ApiOperation({ summary: '获取所有角色列表' })
	// @AuthUser(true)
	// @AuthRole({ key: 'role', apply: 'query' })
	async findRoleAll(@Query() query: RoleIdDto.FindRoleDto) {
		return await this.roleService.findRoleAll(query)
	}

	@Get('info')
	@ApiOperation({ summary: '获取角色详情' })
	@AuthUser(true)
	@AuthRole({ key: 'role', apply: 'get' })
	async findIdRole(@Query() query: RoleIdDto.RoleIdDto) {
		return await this.roleService.findIdRole(query)
	}

	@Put('update')
	@ApiOperation({ summary: '修改角色' })
	@AuthUser(true)
	@AuthRole({ key: 'role', apply: 'update' })
	async updateRole(@Body() body: RoleIdDto.UpdateRoleDto) {
		return await this.roleService.updateRole(body)
	}

	@ApiOperation({ summary: '切换权限状态' })
	@Put('cutover')
	@AuthUser(true)
	@AuthRole({ key: 'role', apply: 'update' })
	async cutoverRole(@Query() query: RoleIdDto.CutoverRoleDto) {
		return await this.roleService.cutoverRole(query)
	}

	@Delete('delete')
	@AuthUser(true)
	@AuthRole({ key: 'role', apply: 'delete' })
	@ApiOperation({ summary: '删除角色' })
	async deleteRole(@Query() body: RoleIdDto.DeleteRoleDto) {
		return await this.roleService.deleteRole(body)
	}
}
