import { Controller, Post, Get } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { RoleService } from './role.service'

@Controller('api/role')
@ApiTags('角色模块')
export class RoleController {
	constructor(private readonly roleService: RoleService) {}

	@Post('create')
	@ApiOperation({ summary: '创建角色' })
	async createRole() {
		return await this.roleService.createRole()
	}

	@Get('all')
	@ApiOperation({ summary: '获取所有角色列表' })
	async findRoleAll() {
		return await this.roleService.findRoleAll()
	}
}
