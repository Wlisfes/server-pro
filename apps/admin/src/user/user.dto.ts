import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class UserLoginDto {
	@ApiProperty({
		description: '用户名',
		example: 'userName'
	})
	@IsNotEmpty({ message: '缺少userName' })
	userName: string

	@ApiProperty({
		description: '密码',
		example: 'password'
	})
	password: string
}
