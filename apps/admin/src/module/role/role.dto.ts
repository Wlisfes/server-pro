/*
 * @Author: 情雨随风
 * @Date: 2020-04-25 00:00:47
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-04-25 23:15:55
 * @Description: RoleDto
 */

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsIn, IsBoolean, IsArray } from 'class-validator'

export interface ApplyInter {
	apply_key: string
	apply_name: string
	status: number
}
export interface AuthInter {
	auth_key: string
	auth_name: string
	all: boolean
	apply: Array<ApplyInter>
}

export class deleteRoleDto {
	@ApiProperty({ description: '角色id', example: '5e9eab973268ca04bcb3285b' })
	@IsNotEmpty({ message: 'id 必填' })
	@IsString({ message: 'id 必须为string' })
	id: string
}

export class createRoleDto {
	@ApiProperty({ description: '角色唯一标识', example: 'admin' })
	@IsNotEmpty({ message: 'role_key 必填' })
	@IsString({ message: 'role_key 必须为string' })
	role_key: string

	@ApiProperty({ description: '角色名称', example: '超级管理员' })
	@IsNotEmpty({ message: 'role_name 必填' })
	@IsString({ message: 'role_name 必须为string' })
	role_name: string

	@ApiProperty({ description: '角色状态', example: 1 })
	@IsNotEmpty({ message: 'status 必填' })
	@IsIn([0, 1], { message: 'status 参数不合法' })
	status: number

	@ApiProperty({
		description: '角色拥有权限',
		example: [
			{
				auth_name: '用户管理',
				auth_key: 'user',
				all: false,
				apply: [{ apply_key: 'create', apply_name: '新增', status: 1 }]
			}
		]
	})
	@IsNotEmpty({ message: 'auth 必填' })
	@IsArray({ message: 'auth 格式错误' })
	auth: AuthInter[]
}

export class changeRoleDto extends deleteRoleDto {
	@ApiProperty({ description: '角色状态', example: 1 })
	@IsNotEmpty({ message: 'status 必填' })
	@IsIn([0, 1], { message: 'status 参数不合法' })
	status: number
}

export class updateRoleDto extends createRoleDto {
	@ApiProperty({ description: '角色id', example: '5e9eab973268ca04bcb3285b' })
	@IsNotEmpty({ message: 'id 必填' })
	@IsString({ message: 'id 必须为string' })
	id: string
}
