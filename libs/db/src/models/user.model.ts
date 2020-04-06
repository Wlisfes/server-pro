/*
 * @Date: 2020-04-03 16:13:21
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-04-03 17:28:57
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
	username: string

	@ApiProperty({ description: '密码' })
	@prop({
		required: true,
		get(val) {
			return val
		},
		set(val) {
			return hashSync(val)
		}
	})
	password: string

	@ApiProperty({ description: '昵称' })
	@prop({ required: true })
	nick_name: string

	@ApiProperty({ description: '头像' })
	@prop({ default: '' })
	avatar: string

	@ApiProperty({ description: '账户是否禁用' })
	@prop({ default: false })
	disable: boolean
}
