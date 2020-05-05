import { Controller, Get, Post, Body, Delete, Query, Put } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { AuthUser, AuthRoles } from '../../guard/auth.guard'
import { UserService } from './user.service'
import { loginUserDto, createUserDto, deleteUserDto, updateUserDto, changeUserDto } from './user.dto'

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
	@ApiOperation({ summary: '获取所有用户列表' })
	// @AuthUser(true) //需要验证登录
	@AuthRoles({ role: 'admin', apply: ['find'] })
	async findUserAll() {
		return await this.userService.findUserAll()
	}

	@Put('change')
	@ApiOperation({ summary: '切换用户状态' })
	async changeUser(@Body() body: changeUserDto) {
		return await this.userService.changeUser(body)
	}

	@Put('update')
	@ApiOperation({ summary: '修改用户信息' })
	async updateUser(@Body() body: updateUserDto) {
		return await this.userService.updateUser(body)
	}

	@Put('update/roles')
	@ApiOperation({ summary: '修改用户权限' })
	async updateUserRoles() {}

	@Delete('delete')
	@ApiOperation({ summary: '删除用户' })
	// @AuthUser(true) //需要验证登录
	@AuthRoles({ role: 'admin', apply: ['delete'] })
	async deleteUser(@Query() query: deleteUserDto) {
		return await this.userService.deleteUser(query.id)
	}
}
