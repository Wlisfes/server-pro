import { Controller, Get, Post, Body, Delete } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { AuthUser, AuthRoles } from '../../guard/auth.guard'
import { UserService } from './user.service'
import { loginUserDto, createUserDto } from './user.dto'

@Controller('api/user')
@ApiTags('用户模块')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('login')
	@ApiOperation({ summary: '用户登陆' })
	async loginUser(@Body() body: loginUserDto) {
		return await this.userService.loginUser(body)
	}

	@Post('create')
	@ApiOperation({ summary: '创建用户' })
	async createUser(@Body() body: createUserDto) {
		return await this.userService.createUser(body)
	}

	@Get('all')
	// @AuthUser(true) //需要验证登录
	@ApiOperation({ summary: '获取所有用户列表' })
	async findUserAll() {
		return await this.userService.findUserAll()
	}

	@Delete('delete')
	// @AuthUser(true) //需要验证登录
	@ApiOperation({ summary: '删除用户' })
	@AuthRoles('admin', 'delete')
	async deleteUser() {}
}
