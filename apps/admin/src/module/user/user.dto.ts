import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class UserLoginDto {
	@ApiProperty({ description: '用户名', example: 'admin' })
	@IsNotEmpty({ message: 'username 必填' })
	username: string

	@ApiProperty({ description: '密码', example: 'password' })
	@IsNotEmpty({ message: 'password 必填' })
	password: string
}

export class UserCreateDto extends UserLoginDto {
	@ApiProperty({ description: '昵称', example: '情雨随风' })
	@IsNotEmpty({ message: 'nick_name 必填' })
	nick_name: string
}

export class UserUpdateDto extends UserCreateDto {
	@ApiProperty({ description: '用户id', example: '5e88aab08f5c3936cc73e32a' })
	@IsNotEmpty({ message: 'id 必填' })
	id: string

	@ApiProperty({ description: '头像', example: '图片url' })
	avatar?: string

	@ApiProperty({ description: '账户是否禁用', example: false })
	disable?: boolean
}
