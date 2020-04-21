/*
 * @Author: 情雨随风
 * @Date: 2020-04-21 20:59:19
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-04-21 23:31:48
 * @Description: 角色权限表
 */

import { prop, modelOptions, DocumentType, Ref } from '@typegoose/typegoose'
import { IsNotEmpty, IsString, IsNumber } from 'class-validator'
import { modelsOptions } from '../utils'
import { User } from './user'

export type UserDocument = DocumentType<Role>

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
	@prop()
	role_name: string

	@prop({ ref: 'User' })
	role_user: Ref<User>

	@prop()
	auth: Array<Auth>
}
