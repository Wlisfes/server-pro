/*
 * @Author: 情雨随风
 * @Date: 2020-04-21 20:59:19
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-04-21 23:31:48
 * @Description: 角色权限表
 */

import { prop, modelOptions, DocumentType, Ref } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsNumber } from 'class-validator'
import { modelsOptions } from '../utils'
import { User } from './user'

export type RoleDocument = DocumentType<Role>

export class Apply {
	@prop()
	@IsNotEmpty()
	@IsString()
	apply_name: string

	@prop()
	@IsNotEmpty()
	@IsString()
	apply: string

	@prop({ default: 1 })
	@IsString()
	@IsNumber()
	status: number
}

export class Auth {
	@prop()
	@IsNotEmpty()
	@IsString()
	auth_name: string

	@prop()
	apply: Array<Apply>
}

@modelOptions({
	schemaOptions: { ...modelsOptions }
})
export class Role {
	@ApiProperty({ description: '角色昵称' })
	@prop()
	@IsNotEmpty()
	@IsString()
	role_name: string

	// @prop({ ref: 'User' })
	// role_user: Ref<User>

	@ApiProperty({ description: '用户id' })
	@prop()
	@IsNotEmpty()
	@IsString()
	role_uid: string

	@prop()
	auth: Array<Auth>
}
