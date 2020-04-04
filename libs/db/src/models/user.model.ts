/*
 * @Date: 2020-04-03 16:13:21
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-04-03 17:28:57
 * @Description: 用户表
 */

import { prop, modelOptions, DocumentType } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'

export type UserDocument = DocumentType<User>

@modelOptions({
	schemaOptions: {
		timestamps: {
			createdAt: 'create_time', //重命名创建时间
			updatedAt: 'update_time' //重命名更新时间
		},
		versionKey: false,
		toJSON: {
			transform(doc, ret, options) {
				ret.id = doc.id
				delete ret._id
				return ret
			}
		}
	}
})
export class User {
	@ApiProperty({ description: '用户名' })
	@prop({ required: true })
	name: string

	@ApiProperty({ description: '密码' })
	@prop({ required: true })
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
