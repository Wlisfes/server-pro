import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class LoginDto {
	@ApiProperty({ description: '用户名', example: 'admin' })
	@IsNotEmpty({ message: 'name 必填' })
	name: string

	@ApiProperty({ description: '密码', example: 'password' })
	@IsNotEmpty({ message: 'password 必填' })
	password: string
}

export class CreateDto extends LoginDto {
	@ApiProperty({ description: '昵称', example: '情雨随风' })
	@IsNotEmpty({ message: 'nick_name 必填' })
	nick_name: string
}

export class UpdateDto extends CreateDto {
	@ApiProperty({ description: '用户id', example: '5e88aab08f5c3936cc73e32a' })
	@IsNotEmpty({ message: 'id 必填' })
	id: string

	@ApiProperty({ description: '头像', example: '图片url' })
	avatar?: string

	@ApiProperty({ description: '账户是否禁用', example: false })
	disable?: boolean
}
