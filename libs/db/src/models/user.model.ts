/*
 * @Date: 2020-04-03 16:13:21
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-04-03 16:21:14
 * @Description: 用户表
 */

import { prop, modelOptions, DocumentType } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'

export type UserDocument = DocumentType<User>

@modelOptions({
	schemaOptions: {
		timestamps: true
	}
})
export class User {
	@ApiProperty({ description: '用户名', example: 'user1' })
	@prop()
	userName: string
}
