import { Controller, Get, Post } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { UserService } from './user.service'

@Controller('api/user')
@ApiTags('用户模块')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('create')
	@ApiOperation({ summary: '创建用户' })
	async createUser() {
		return await this.userService.createUser()
	}

	@Get('all')
	@ApiOperation({ summary: '获取所有用户列表' })
	async findUserAll() {
		return await this.userService.findUserAll()
	}
}
