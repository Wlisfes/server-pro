import { Controller, Post, Get, Body } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { UserService } from './user.service'
import { UserloginDto } from './user.dto'

@Controller('user')
@ApiTags('用户')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('login')
	@ApiOperation({
		summary: '用户登陆'
	})
	async login(@Body() body: UserloginDto) {
		return body
	}

	@Post('create')
	@ApiOperation({
		summary: '创建用户'
	})
	async create(@Body() body: UserloginDto) {
		return this.userService.create(body)
	}

	@Get('all')
	@ApiOperation({
		summary: '获取所有用户'
	})
	async findAll() {
		return this.userService.findAll()
	}

	@Get('one')
	@ApiOperation({
		summary: '获取用户详情信息'
	})
	async findOne() {}
}
