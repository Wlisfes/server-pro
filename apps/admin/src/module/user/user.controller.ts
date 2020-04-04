import { Controller, Post, Get, Body, UsePipes, ValidationPipe, Put, Delete, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { UserService } from './user.service'
import { LoginDto, CreateDto, UpdateDto } from './user.dto'

@Controller('api/user')
@ApiTags('用户')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('login')
	@UsePipes(new ValidationPipe({ transform: true }))
	@ApiOperation({ summary: '用户登陆' })
	async login(@Body() body: LoginDto) {
		return await this.userService.login(body)
	}

	@Post('create')
	@ApiOperation({ summary: '创建用户' })
	async create(@Body() body: CreateDto) {
		return await this.userService.create(body)
	}

	@Get('all')
	@ApiOperation({ summary: '获取所有用户列表' })
	async findAll() {
		return await this.userService.findAll()
	}

	@Get('one')
	@ApiOperation({ summary: '获取用户详情信息' })
	async findOne(@Query('id') id: string) {
		return await this.userService.findOne(id)
	}

	@Put('update')
	@ApiOperation({ summary: '修改用户信息' })
	async update(@Body() body: UpdateDto) {
		return await this.userService.update(body)
	}

	@Delete('remove')
	@ApiOperation({ summary: '删除用户' })
	async remove(@Query('id') id: string) {
		return await this.userService.remove(id)
	}
}
