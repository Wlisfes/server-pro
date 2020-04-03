import { ApiProperty } from '@nestjs/swagger'

export class UserloginDto {
	@ApiProperty({
		description: '用户名',
		example: 'userName'
	})
	userName: string

	@ApiProperty({
		description: '密码',
		example: 'password'
	})
	password: string
}
