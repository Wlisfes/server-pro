/*
 * @Date: 2020-04-21 13:45:40
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-04-22 13:01:22
 * @Description: 用户表
 */

import { prop, modelOptions, DocumentType, Ref } from '@typegoose/typegoose'
import { IsNotEmpty, IsString, IsNumber, IsEmail } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { hashSync } from 'bcryptjs'
import { modelsOptions } from '../utils'
import { UserRole } from './userRole'

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
	@prop({
		get: val => val,
		set: val => hashSync(val)
	})
	@IsNotEmpty()
	@IsString()
	password: string

	@ApiProperty({ description: '昵称' })
	@prop()
	@IsNotEmpty()
	@IsString()
	nickname: string

	@ApiProperty({ description: '邮箱' })
	@prop({ default: null })
	@IsString()
	@IsEmail()
	email: string

	@ApiProperty({ description: '手机号' })
	@prop({ default: null })
	@IsNumber()
	mobile: number | string | null

	@ApiProperty({ description: '头像' })
	@prop({ default: null })
	@IsString()
	avatar: string

	@ApiProperty({ description: '账户状态' })
	@prop({ default: 1 })
	@IsNumber()
	status: number

	@ApiProperty({ description: '账户所属角色' })
	@prop({ ref: 'UserRole', default: null })
	roles: Ref<UserRole>
}
