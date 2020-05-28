import { Controller, Get, Post, Body } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { UserService } from './user.service'
import { CreateUserDto, UpdateUserRoleDto } from './user.dto'

@Controller('api/user')
@ApiTags('用户模块')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('create')
	@ApiOperation({ summary: '创建用户' })
	async createUser(@Body() body: CreateUserDto) {
		return await this.userService.createUser(body)
	}

	@Get('all')
	@ApiOperation({ summary: '获取所有用户列表' })
	async findUserAll() {
		return await this.userService.findUserAll()
	}

	@Post('update/role')
	@ApiOperation({ summary: '修改用户角色权限' })
	async updateUserRole(@Body() body: UpdateUserRoleDto) {
		return await this.userService.updateUserRole(body)
	}

	@Post('article/role')
	async updateUserArticle() {
		return await this.userService.updateUserArticle()
	}
}
