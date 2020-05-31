/*
 * @Author: 情雨随风
 * @Date: 2020-05-30 17:03:03
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-05-30 21:33:54
 * @Description: authDto
 */

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsNumber, IsIn, ValidateNested, IsArray } from 'class-validator'
import { Type } from 'class-transformer'

export class Apply {
	@Type(() => String)
	@ApiProperty({ description: '操作key', example: 'create' })
	@IsNotEmpty({ message: 'key 必填' })
	@IsString({ message: 'key is string' })
	key: string

	@Type(() => String)
	@ApiProperty({ description: '操作名称', example: '新增' })
	@IsNotEmpty({ message: 'name 必填' })
	@IsString({ message: 'name is string' })
	name: string

	@Type(() => Number)
	@ApiProperty({ description: '状态', example: 1 })
	@IsNumber({}, { message: 'status is number' })
	@IsIn([0, 1], { message: 'status 不合法' })
	status: number
}

export class Auth {
	@Type(() => String)
	@ApiProperty({ description: '权限key', example: 'user' })
	@IsNotEmpty({ message: 'auth_key 必填' })
	@IsString({ message: 'auth_key is string' })
	auth_key: string

	@Type(() => String)
	@ApiProperty({ description: '权限名称', example: '用户管理' })
	@IsNotEmpty({ message: 'auth_name 必填' })
	@IsString({ message: 'auth_name is string' })
	auth_name: string

	@Type(() => Number)
	@ApiProperty({ description: '权限状态', example: 1 })
	@IsNumber({}, { message: 'status is number' })
	@IsIn([0, 1], { message: 'status 不合法' })
	status: number

	@ApiProperty({
		description: '权限拥有操作',
		example: [
			{ key: 'create', name: '新增', status: 1 },
			{ key: 'update', name: '修改', status: 1 },
			{ key: 'delete', name: '删除', status: 1 },
			{ key: 'get', name: '查找', status: 1 }
		]
	})
	@ValidateNested()
	@IsArray()
	@Type(() => Apply)
	apply: Apply[]
}

export class AuthId {
	@Type(() => Number)
	@ApiProperty({ description: '权限模块id', example: 1 })
	@IsNotEmpty({ message: 'id 必填' })
	@IsNumber({}, { message: 'id is number' })
	id: number
}

export class DeleteAuthDto extends AuthId {}

export class CreateAuthDto extends Auth {}

export class CutoverAuthDto extends AuthId {}

export class UpdateAuthDto extends Auth {
	@Type(() => Number)
	@ApiProperty({ description: '权限模块id', example: 1 })
	@IsNotEmpty({ message: 'id 必填' })
	@IsNumber({}, { message: 'status is number' })
	id: number
}
