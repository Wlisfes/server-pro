import { Controller, Post, Put, Delete, Get, Body, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { CreateAuthDto, UpdateAuthDto, DeleteAuthDto, CutoverAuthDto } from './auth.dto'

@Controller('api/auth')
@ApiTags('权限模块')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiOperation({ summary: '创建权限模块' })
	@Post('create')
	async createAuth(@Body() body: CreateAuthDto) {
		return this.authService.createAuth(body)
	}

	@ApiOperation({ summary: '获取所有权限列表' })
	@Get('all')
	async findAuthAll() {
		return await this.authService.findAuthAll()
	}

	@ApiOperation({ summary: '修改权限模块' })
	@Put('update')
	async updateAuth(@Body() body: UpdateAuthDto) {
		return this.authService.updateAuth(body)
	}

	@ApiOperation({ summary: '切换权限状态' })
	@Put('cutover')
	async cutoverAuth(@Query() query: CutoverAuthDto) {
		return await this.authService.cutoverAuth(query)
	}

	@ApiOperation({ summary: '删除权限模块' })
	@Delete('delete')
	async deleteAuth(@Query() query: DeleteAuthDto) {
		return await this.authService.deleteAuth(query)
	}
}
