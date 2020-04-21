/*
 * @Date: 2020-04-21 13:45:40
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-04-21 13:50:12
 * @Description: 用户表
 */

import { prop, modelOptions, DocumentType } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'
import { hashSync } from 'bcryptjs'
import { modelsOptions } from '../utils'

export type UserDocument = DocumentType<User>

@modelOptions({
	schemaOptions: { ...modelsOptions }
})
export class User {
	@ApiProperty({ description: '用户名' })
	@prop({ required: true })
	user_name: string

	@ApiProperty({ description: '密码' })
	@prop({
		required: true,
		get: val => val,
		set: val => hashSync(val)
	})
	password: string

	@ApiProperty({ description: '昵称' })
	@prop({ required: true })
	nick_name: string

	@ApiProperty({ description: '头像' })
	@prop({ default: '' })
	avatar: string

	@ApiProperty({ description: '账户状态' })
	@prop({ default: 1 })
	status: number
}
