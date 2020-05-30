/*
 * @Author: 情雨随风
 * @Date: 2020-05-30 16:34:26
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-05-30 19:15:28
 * @Description: roleDto
 */

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsNumber, IsIn, Allow } from 'class-validator'
import { Type } from 'class-transformer'

export class Role {
	@Type(() => String)
	@ApiProperty({ description: '角色key', example: 'visitor' })
	@IsNotEmpty({ message: 'role_key 必填' })
	@IsString({ message: 'role_key is string' })
	role_key: string

	@Type(() => String)
	@ApiProperty({ description: '角色名称', example: '游客' })
	@IsNotEmpty({ message: 'role_name 必填' })
	@IsString({ message: 'role_name is string' })
	role_name: string

	@Type(() => Number)
	@ApiProperty({ description: '角色状态', example: 1 })
	@IsNumber({}, { message: 'status is number' })
	@IsIn([0, 1], { message: 'status 不合法' })
	status: number
}

export class CreateRoleDto extends Role {}

export class UpdateRoleDto extends Role {
	@Type(() => Number)
	@ApiProperty({ description: '角色id', example: 1 })
	@IsNotEmpty({ message: 'id 必填' })
	@IsNumber({}, { message: 'status is number' })
	id: number
}

export class DeleteRoleDto {
	@Type(() => Number)
	@ApiProperty({ description: '角色id', example: 1 })
	@IsNotEmpty({ message: 'id 必填' })
	@IsNumber({}, { message: 'status is number' })
	id: number
}
