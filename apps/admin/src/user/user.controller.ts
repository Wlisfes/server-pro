import { Controller, Post, Get } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { UserService } from './user.service'

@Controller('user')
@ApiTags('用户')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('login')
	@ApiOperation({
		summary: '用户登陆'
	})
	async login() {
		return {
			success: true
		}
	}

	@Post('create')
	@ApiOperation({
		summary: '创建用户'
	})
	async create() {
		return ''
	}

	@Get('all')
	@ApiOperation({
		summary: '获取所有用户'
	})
	async findAll() {
		return this.userService.findAll()
	}
}
