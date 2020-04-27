/*
 * @Date: 2020-04-23 13:53:12
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-04-24 12:50:52
 * @Description: AuthDto
 */

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsIn, IsBoolean, IsArray } from 'class-validator'

export class createAuthDto {
	@ApiProperty({ description: '权限模块状态', example: 1 })
	@IsNotEmpty({ message: 'status 必填' })
	@IsIn([0, 1], { message: 'status 参数不合法' })
	status: number

	@ApiProperty({ description: '权限模块key', example: 'user' })
	@IsNotEmpty({ message: 'auth_key 必填' })
	@IsString({ message: 'auth_key 必须为string' })
	auth_key: string

	@ApiProperty({ description: '权限模块名称', example: '用户管理' })
	@IsNotEmpty({ message: 'auth_name 必填' })
	@IsString({ message: 'auth_name 必须为string' })
	auth_name: string

	@ApiProperty({ description: '是否全选', example: false })
	@IsNotEmpty({ message: 'all 必填' })
	@IsBoolean({ message: 'all 必须为boolean' })
	all: boolean

	@ApiProperty({ description: '可操作权限列表', example: [{ apply_key: 'create', apply_name: '新增', status: 1 }] })
	@IsNotEmpty({ message: 'apply 必填' })
	@IsArray({ message: 'apply 格式错误' })
	apply: []
}

export class deleteAuthDto {
	@ApiProperty({ description: '权限模块id', example: '5e9eab973268ca04bcb3285b' })
	@IsNotEmpty({ message: 'id 必填' })
	@IsString({ message: 'id 必须为string' })
	id: string
}

export class changeAuthDto extends deleteAuthDto {
	@ApiProperty({ description: '权限模块状态', example: 1 })
	@IsNotEmpty({ message: 'status 必填' })
	@IsIn([0, 1], { message: 'status 参数不合法' })
	status: number
}

export class updateAuthDto extends createAuthDto {
	@ApiProperty({ description: '权限模块id', example: '5e9eab973268ca04bcb3285b' })
	@IsNotEmpty({ message: 'id 必填' })
	@IsString({ message: 'id 必须为string' })
	id: string
}
