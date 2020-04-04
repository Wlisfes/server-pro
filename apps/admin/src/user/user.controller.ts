import {
	Controller,
	Post,
	Get,
	Body,
	UsePipes,
	ValidationPipe,
	Put,
	Delete,
	Query,
	HttpException,
	HttpStatus
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiProperty } from '@nestjs/swagger'
import { UserService } from './user.service'
// import { UserLoginDto } from './user.dto'
import { IsNotEmpty } from 'class-validator'

class UserDto {
	@ApiProperty({ description: '用户名', example: 'admin' })
	@IsNotEmpty({ message: 'name 必填' })
	name: string

	@ApiProperty({ description: '密码', example: 'password' })
	@IsNotEmpty({ message: 'password 必填' })
	password: string

	@ApiProperty({ description: '昵称', example: '情雨随风' })
	@IsNotEmpty({ message: 'nick_name 必填' })
	nick_name: string
}

@Controller('api/user')
@ApiTags('用户')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('login')
	@UsePipes(new ValidationPipe({ transform: true }))
	@ApiOperation({ summary: '用户登陆' })
	async login(@Body() body: UserDto) {
		console.log(111)
		throw new HttpException('验证码错误！', HttpStatus.BAD_REQUEST)
		// return body
	}

	@Post('create')
	@ApiOperation({ summary: '创建用户' })
	async create(@Body() body: UserDto) {
		return this.userService.create(body)
	}

	@Get('all')
	@ApiOperation({ summary: '获取所有用户列表' })
	async findAll() {
		return this.userService.findAll()
	}

	@Get('one')
	@ApiOperation({ summary: '获取用户详情信息' })
	async findOne(@Query() query: { id: string }) {
		return this.userService.findOne('5e880c3cac4e183a68e8c890')
	}

	@Put('update')
	@ApiOperation({ summary: '修改用户信息' })
	async update() {}

	@Delete('remove')
	@ApiOperation({ summary: '删除用户' })
	async remove() {
		return await this.userService.remove('5e880c3cac4e183a68e8c890')
	}
}
