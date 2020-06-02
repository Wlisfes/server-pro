import { Controller, Post, Put, Delete, Get, Body, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { CreateAuthDto, UpdateAuthDto, DeleteAuthDto, CutoverAuthDto } from './auth.dto'
import { AuthUser, AuthRole } from '@/guard/auth.guard'

@Controller('api/auth')
@ApiTags('权限模块')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiOperation({ summary: '创建权限模块' })
	@Post('create')
	@AuthUser(true)
	@AuthRole({ key: 'auth', apply: 'create' })
	async createAuth(@Body() body: CreateAuthDto) {
		return this.authService.createAuth(body)
	}

	@ApiOperation({ summary: '获取所有权限列表' })
	@Get('all')
	@AuthUser(true)
	@AuthRole({ key: 'auth', apply: 'get' })
	async findAuthAll() {
		return await this.authService.findAuthAll()
	}

	@Get('info')
	@ApiOperation({ summary: '获取权限模块详情' })
	@AuthUser(true)
	@AuthRole({ key: 'auth', apply: 'query' })
	async findIdAuth(@Query() query: CutoverAuthDto) {
		return await this.authService.findIdAuth(query)
	}

	@ApiOperation({ summary: '修改权限模块' })
	@Put('update')
	@AuthUser(true)
	@AuthRole({ key: 'auth', apply: 'update' })
	async updateAuth(@Body() body: UpdateAuthDto) {
		return this.authService.updateAuth(body)
	}

	@ApiOperation({ summary: '切换权限状态' })
	@Put('cutover')
	@AuthUser(true)
	@AuthRole({ key: 'auth', apply: 'update' })
	async cutoverAuth(@Query() query: CutoverAuthDto) {
		return await this.authService.cutoverAuth(query)
	}

	@ApiOperation({ summary: '删除权限模块' })
	@Delete('delete')
	@AuthUser(true)
	@AuthRole({ key: 'auth', apply: 'delete' })
	async deleteAuth(@Query() query: DeleteAuthDto) {
		return await this.authService.deleteAuth(query)
	}
}
