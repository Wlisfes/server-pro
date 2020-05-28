/*
 * @Date: 2020-05-28 12:42:40
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-05-28 17:25:33
 * @Description: userDto
 */

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsEmail, IsIn, IsNumber, ValidateNested, IsObject } from 'class-validator'

export class User {
	@ApiProperty({ description: '用户名', example: 'admin' })
	@IsNotEmpty({ message: 'username 必填' })
	@IsString({ message: 'username is string' })
	username: string

	@ApiProperty({ description: '密码', example: '3633' })
	@IsNotEmpty({ message: 'password 必填' })
	@IsString({ message: 'username is string' })
	password: string

	@ApiProperty({ description: '昵称', example: '猪头' })
	@IsNotEmpty({ message: 'nickname 必填' })
	@IsString({ message: 'username is string' })
	nickname: string
}

export class CreateUserDto extends User {
	@ApiProperty({ description: '邮箱', example: '888888@qq.com' })
	@IsEmail({}, { message: 'email 错误' })
	@IsString({ message: 'username is string' })
	email: string

	@ApiProperty({ description: '手机号', example: 18888888888 })
	mobile: string

	@ApiProperty({ description: '头像', example: 'http://xxx.com/xxx.png' })
	@IsString({ message: 'avatar is string' })
	avatar: string

	@ApiProperty({ description: '用户状态', example: 1 })
	@IsNumber({}, { message: 'status is number' })
	@IsIn([0, 1], { message: 'status 不合法' })
	status: number
}

export class UserRoleDto {
	@ApiProperty({ description: '角色key', example: 'visitor' })
	@IsNotEmpty({ message: 'role_key 必填' })
	@IsString({ message: 'role_key is string' })
	role_key: string

	@ApiProperty({ description: '角色名称', example: '游客' })
	@IsNotEmpty({ message: 'role_name 必填' })
	@IsString({ message: 'role_name is string' })
	role_name: string

	@ApiProperty({ description: '角色状态', example: 1 })
	@IsNumber({}, { message: 'status is number' })
	@IsIn([0, 1], { message: 'status 不合法' })
	status: number
}
export class UpdateUserRoleDto {
	@ApiProperty({ description: 'uid', example: 1590652354316 })
	@IsNotEmpty({ message: 'uid 必填' })
	uid: string

	@ApiProperty({
		description: '用户所属角色',
		example: {
			role_key: 'visitor',
			role_name: '游客',
			status: 1
		}
	})
	@ValidateNested()
	@IsObject()
	@IsNotEmpty({ message: 'role 必填' })
	role: UserRoleDto
}
