import { Controller, Get, Post, Body, Delete, Query, Put } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { deleteAuthDto, changeAuthDto } from './auth.dto'

@Controller('api/auth')
@ApiTags('权限模块')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get('all')
	@ApiOperation({ summary: '获取所有权限列表' })
	async findAuthAll() {
		return await this.authService.findAuthAll()
	}

	@Post('create')
	@ApiOperation({ summary: '新增权限模块' })
	async createAuth(@Body() body) {
		return await this.authService.createAuth()
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
}
