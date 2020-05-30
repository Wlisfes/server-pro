/*
 * @Date: 2020-05-28 12:42:40
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-05-28 17:25:33
 * @Description: userDto
 */

import { ApiProperty } from '@nestjs/swagger'
import {
	IsNotEmpty,
	IsString,
	IsEmail,
	IsIn,
	IsNumber,
	ValidateNested,
	IsObject,
	IsArray,
	Allow
} from 'class-validator'
import { Type } from 'class-transformer'
import { Auth } from '@/module/auth/auth.dto'
import { Role } from '@/module/role/role.dto'

export class User {
	id: number
	uid: number
	username: string
	nickname: string
	status: number
	createTime: string
	password?: string
	email?: string | null
	mobile?: string | null
	avatar?: string | null
	article?: [] | null
	role?: {
		id: number
		role_key: string
		role_name: string
		status: 1 | 0
		createTime: string
	} | null
	auth?: Array<{
		id: number
		auth_key: string
		auth_name: string
		status: 1 | 0
		createTime: string
		apply: Array<{
			key: string
			name: string
			status: 1 | 0
		}>
	}> | null;
	[key: string]: any
}

export class Users {
	@ApiProperty({ description: '用户名', example: 'admin' })
	@IsNotEmpty({ message: 'username 必填' })
	@IsString({ message: 'username is string' })
	username: string

	@ApiProperty({ description: '密码', example: '3633' })
	@IsNotEmpty({ message: 'password 必填' })
	@IsString({ message: 'password is string' })
	password: string

	@ApiProperty({ description: '昵称', example: '猪头' })
	@IsNotEmpty({ message: 'nickname 必填' })
	@IsString({ message: 'nickname is string' })
	nickname: string
}

export class CreateUserDto extends Users {
	@ApiProperty({ description: '邮箱', example: '888888@qq.com' })
	@IsEmail({}, { message: 'email 错误' })
	@IsString({ message: 'email is string' })
	email?: string

	@ApiProperty({ description: '手机号', example: 18888888888 })
	mobile?: string

	@ApiProperty({ description: '头像', example: 'http://xxx.com/xxx.png' })
	@IsString({ message: 'avatar is string' })
	avatar?: string

	@ApiProperty({ description: '用户状态', example: 1 })
	@IsNumber({}, { message: 'status is number' })
	@IsIn([0, 1], { message: 'status 不合法' })
	status?: number
}

type Constructor<T = {}> = new (...args: any[]) => T

function compose<T extends Constructor>(U: T) {
	return class extends U {}
}

export class UpdateUserDto extends compose(CreateUserDto) {}

export class LoginUserDto {
	@Type(() => String)
	@ApiProperty({ description: '用户名', example: 'admin' })
	@Allow()
	username?: string

	@Type(() => String)
	@ApiProperty({ description: '密码', example: '3633' })
	@IsString({ message: 'password is string' })
	password: string

	@Type(() => String)
	@ApiProperty({ description: '邮箱', example: '888888@qq.com' })
	@Allow()
	email?: string

	@Type(() => String)
	@ApiProperty({ description: '手机号', example: 18888888888 })
	@Allow()
	mobile?: string
}

export class UpdateUserRoleDto {
	@ApiProperty({ description: 'uid', example: 1590652354316 })
	@IsNotEmpty({ message: 'uid 必填' })
	uid: number

	@ApiProperty({
		description: '用户所属角色',
		example: { role_key: 'visitor', role_name: '游客', status: 1 }
	})
	@ValidateNested()
	@IsObject()
	@IsNotEmpty({ message: 'role 必填' })
	@Type(() => Role)
	role: Role

	@ApiProperty({
		description: '用户拥有权限',
		example: [
			{
				auth_key: 'user',
				auth_name: '用户管理',
				status: 1,
				apply: [
					{ key: 'create', name: '新增', status: 1 },
					{ key: 'update', name: '修改', status: 1 },
					{ key: 'delete', name: '删除', status: 1 },
					{ key: 'get', name: '查找', status: 1 }
				]
			}
		]
	})
	@ValidateNested()
	@IsArray()
	@Type(() => Auth)
	auth: Auth[]
}
