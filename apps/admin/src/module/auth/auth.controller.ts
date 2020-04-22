import { Controller, Get, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiTags, ApiOperation } from '@nestjs/swagger'

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
}
