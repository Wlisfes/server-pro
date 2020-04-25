/*
 * @Author: 情雨随风
 * @Date: 2020-04-21 20:59:19
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-04-25 16:55:35
 * @Description: 角色权限表
 */

import { prop, modelOptions, DocumentType } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsNumber, IsIn, IsBoolean } from 'class-validator'
import { modelsOptions } from '../utils'

export type RoleDocument = DocumentType<Role>

export class Apply {
	@prop()
	@IsNotEmpty()
	@IsString()
	apply_name: string

	@prop()
	@IsNotEmpty()
	@IsString()
	apply_key: string

	@prop({ default: 1 })
	@IsNotEmpty()
	@IsNumber()
	status: number
}

export class Auth {
	@ApiProperty({ description: '权限模块key' })
	@prop()
	@IsNotEmpty()
	@IsString()
	auth_key: string

	@ApiProperty({ description: '权限模块名称' })
	@prop()
	@IsNotEmpty()
	@IsString()
	auth_name: string

	@ApiProperty({ description: '是否全选' })
	@prop({ default: false })
	@IsNotEmpty()
	@IsBoolean()
	all: boolean

	@prop()
	apply: Array<Apply>
}

@modelOptions({
	schemaOptions: { ...modelsOptions }
})
export class Role {
	@ApiProperty({ description: '角色模块key' })
	@prop()
	@IsNotEmpty()
	@IsString()
	role_key: string

	@ApiProperty({ description: '角色昵称' })
	@prop()
	@IsNotEmpty()
	@IsString()
	role_name: string

	@ApiProperty({ description: '用户id' })
	@prop({ default: null })
	@IsString()
	role_uid: string

	@ApiProperty({ description: '角色状态' })
	@prop({ default: 1 })
	@IsNotEmpty({ message: 'status 必填' })
	@IsIn([0, 1], { message: 'status 参数不合法' })
	status: number

	@prop()
	auth: Array<Auth>
}
