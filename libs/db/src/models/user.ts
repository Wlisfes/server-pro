/*
 * @Date: 2020-04-21 13:45:40
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-04-21 16:14:56
 * @Description: 用户表
 */

import { prop, arrayProp, modelOptions, DocumentType, Ref } from '@typegoose/typegoose'
import { IsNotEmpty, IsString, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { hashSync } from 'bcryptjs'
import { modelsOptions } from '../utils'
import { Role } from './role'

export type UserDocument = DocumentType<User>

@modelOptions({
	schemaOptions: { ...modelsOptions }
})
export class User {
	@ApiProperty({ description: '用户名' })
	@IsNotEmpty()
	@IsString()
	@prop()
	username: string

	@ApiProperty({ description: '密码' })
	@IsNotEmpty()
	@IsString()
	@prop({
		get: val => val,
		set: val => hashSync(val)
	})
	password: string

	@ApiProperty({ description: '昵称' })
	@IsNotEmpty()
	@IsString()
	@prop()
	nickname: string

	@ApiProperty({ description: '邮箱' })
	@IsString()
	@prop({ default: null })
	email: string

	@ApiProperty({ description: '手机号' })
	@IsNumber()
	@prop({ default: null })
	mobile: number

	@ApiProperty({ description: '头像' })
	@IsString()
	@prop({ default: null })
	avatar: string

	@ApiProperty({ description: '账户状态' })
	@IsNumber()
	@prop({ default: 1 })
	status: number

	@ApiProperty({ description: '账户所属角色' })
	@arrayProp({
		ref: 'Role',
		localField: '_id',
		foreignField: 'role_user'
	})
	roles: Ref<Role>
}
