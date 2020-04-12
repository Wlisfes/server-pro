import { Controller } from '@nestjs/common'
import { Post, Get, Body, Put, Delete, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { UserService } from './user.service'
import { AuthService } from '../auth/auth.service'
import { UserLoginDto, UserCreateDto, UserUpdateDto } from './user.dto'
import { AuthUser, AuthRoles } from '../../guard/auth.guard'
import { ToolService } from '../../service/tool/tool.service'

@Controller('api/user')
@ApiTags('用户模块')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly authService: AuthService,
		private readonly toolService: ToolService
	) {}

	@Post('login')
	@ApiOperation({ summary: '用户登陆' })
	async login(@Body() body: UserLoginDto) {
		const response = await this.userService.login(body)
		const access_token = await this.authService.sign((response as any).id)

		return { ...response, access_token }
	}

	@Post('create')
	@ApiOperation({ summary: '创建用户' })
	async create(@Body() body: UserCreateDto) {
		return await this.userService.create(body)
	}

	@Get('all')
	@AuthUser(true) //需要验证登录
	@ApiOperation({ summary: '获取所有用户列表' })
	async findAll() {
		return await this.userService.findAll()
	}

	@Get('one')
	@AuthRoles('admin', 'edit')
	@ApiOperation({ summary: '获取用户详情信息' })
	async findOne(@Query('id') id: string) {
		return await this.userService.findOne(id)
	}

	@Put('update')
	@ApiOperation({ summary: '修改用户信息' })
	async update(@Body() body: UserUpdateDto) {
		return await this.userService.update(this.toolService.filter<UserUpdateDto>(body))
	}

	@Delete('remove')
	@ApiOperation({ summary: '删除用户' })
	async remove(@Query('id') id: string) {
		return await this.userService.remove(id)
	}
}
