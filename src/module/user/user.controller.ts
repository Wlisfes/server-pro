import { Controller, Get, Post, Body, Put } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { UserService } from './user.service'
import { CreateUserDto, UpdateUserRoleDto, LoginUserDto, UpdateUserDto } from './user.dto'

@Controller('api/user')
@ApiTags('用户模块')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiOperation({ summary: '登录' })
	@Post('login')
	async loginUser(@Body() body: LoginUserDto) {
		return await this.userService.loginUser(body)
	}

	@ApiOperation({ summary: '创建用户' })
	@Post('create')
	async createUser(@Body() body: CreateUserDto) {
		return await this.userService.createUser(body)
	}

	@ApiOperation({ summary: '获取所有用户列表' })
	@Get('all')
	async findUserAll() {
		return await this.userService.findUserAll()
	}

	@ApiOperation({ summary: '修改用户角色权限' })
	@Put('update/role')
	async updateUserRole(@Body() body: UpdateUserRoleDto) {
		return await this.userService.updateUserRole(body)
	}

	@ApiOperation({ summary: '修改用户信息' })
	@Put('update')
	async updateUser(@Body() body: UpdateUserDto) {
		console.log(body)
		return body
	}

	@Post('article/role')
	async updateUserArticle() {
		return await this.userService.updateUserArticle()
	}
}
