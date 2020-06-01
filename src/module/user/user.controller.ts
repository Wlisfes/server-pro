import { Controller, Get, Post, Body, Put, Delete, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { UserService } from '@/module/user/user.service'
import { AuthUser, AuthRole } from '@/guard/auth.guard'
import {
	UserUid,
	CreateUserDto,
	UpdateUserRoleDto,
	LoginUserDto,
	UpdateUserDto,
	UserAvatarDto
} from '@/module/user/user.dto'

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
	// @AuthUser(true)
	// @AuthRole({ key: 'user', apply: 'get' })
	async findUserAll() {
		return await this.userService.findUserAll()
	}

	@ApiOperation({ summary: '获取用户详情' })
	@Get('info')
	// @AuthUser(true)
	// @AuthRole({ key: 'user', apply: 'get' })
	async findUidUser(@Query() query: UserUid) {
		return await this.userService.findUidUser(query.uid)
	}

	@ApiOperation({ summary: '修改用户角色权限' })
	@Put('update/role')
	async updateUserRole(@Body() body: UpdateUserRoleDto) {
		return await this.userService.updateUserRole(body)
	}

	@ApiOperation({ summary: '修改用户信息' })
	@Put('update')
	async updateUser(@Body() body: UpdateUserDto) {
		return this.userService.updateUser(body)
	}

	@ApiOperation({ summary: '修改用户头像' })
	@Put('update/avatar')
	async updateUserAvatar(@Body() body: UserAvatarDto) {
		return this.userService.updateUserAvatar(body)
	}

	@ApiOperation({ summary: '切换用户状态' })
	@Put('cutover')
	async cutoverUser(@Query() query: UserUid) {
		return await this.userService.cutoverUser(query)
	}

	@ApiOperation({ summary: '删除用户' })
	@Delete('delete')
	async deleteUser(@Query() query: UserUid) {
		return await this.userService.deleteUser(query)
	}
}
