import { Controller, Get, Post, Body, Delete, Query, Put } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { createAuthDto, deleteAuthDto, changeAuthDto, updateAuthDto } from './auth.dto'

@Controller('api/auth')
@ApiTags('权限模块')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get('all')
	@ApiOperation({ summary: '获取所有权限列表' })
	async findAuthAll(@Query() query) {
		return await this.authService.findAuthAll(query)
	}

	@Post('create')
	@ApiOperation({ summary: '新增权限模块' })
	async createAuth(@Body() body: createAuthDto) {
		return await this.authService.createAuth(body)
	}

	@Delete('delete')
	@ApiOperation({ summary: '删除权限模块' })
	async deleteAuth(@Query() query: deleteAuthDto) {
		return await this.authService.deleteAuth(query.id)
	}

	@Put('change')
	@ApiOperation({ summary: '切换权限模块状态' })
	async changeAuth(@Body() body: changeAuthDto) {
		return await this.authService.changeAuth(body)
	}

	@Put('update')
	@ApiOperation({ summary: '修改权限模块' })
	async updateAuth(@Body() body: updateAuthDto) {
		return await this.authService.updateAuth(body)
	}
}
