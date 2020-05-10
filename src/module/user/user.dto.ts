/*
 * @Date: 2020-04-21 15:54:20
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-04-21 16:46:30
 * @Description: userDto
 */

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsNumber, IsIn, IsEmail, ValidateIf } from 'class-validator'

export class loginUserDto {
	@ApiProperty({ description: '用户名', example: 'admin' })
	@IsNotEmpty({ message: 'username 必填' })
	@IsString()
	username: string

	@ApiProperty({ description: '密码', example: '3633' })
	@IsNotEmpty({ message: 'password 必填' })
	@IsString()
	password: string
}

export class createUserDto extends loginUserDto {
	@ApiProperty({ description: '昵称', example: '猪头' })
	@IsNotEmpty({ message: 'nickname 必填' })
	@IsString()
	nickname: string
}

export class deleteUserDto {
	@ApiProperty({ description: '用户id', example: '5e9eab973268ca04bcb3285b' })
	@IsNotEmpty({ message: 'id 必填' })
	@IsString()
	id: string
}

export class changeUserDto extends deleteUserDto {
	@ApiProperty({ description: '用户状态', example: 1 })
	@IsNotEmpty({ message: 'status 必填' })
	@IsIn([0, 1], { message: 'status 参数不合法' })
	status: number
}

export class updateUserAvatarDto extends deleteUserDto {
	@ApiProperty({ description: '头像', example: 'http://xxx.cn/xxx.png' })
	@IsString({ message: 'is string' })
	avatar: string
}

export class updateUserDto extends deleteUserDto {
	@ApiProperty({ description: '昵称', example: '猪头' })
	@IsString({ message: 'is string' })
	nickname: string

	@ApiProperty({ description: '手机号', example: 18888888888 })
	mobile: number | string

	@ApiProperty({ description: '邮箱', example: '猪头' })
	@IsString({ message: 'is string' })
	@IsEmail({}, { message: 'email 错误' })
	email: string

	@ApiProperty({ description: '用户状态', example: 1 })
	@IsNotEmpty({ message: 'status 必填' })
	@IsIn([0, 1], { message: 'status 参数不合法' })
	status: number

	@ApiProperty({
		description: '用户权限',
		example: {
			id: '',
			auth: [],
			status: 0,
			role_name: '',
			role_key: ''
		}
	})
	@IsNotEmpty({ message: 'roles 必填' })
	roles: any
}
