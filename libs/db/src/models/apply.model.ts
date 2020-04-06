/*
 * @Author: 情雨随风
 * @Date: 2020-04-06 13:22:01
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-04-06 22:55:38
 * @Description: 操作类型表
 */

import { prop, modelOptions, DocumentType } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'
import { modelsOptions } from '../utils'

export type UserDocument = DocumentType<Apply>

@modelOptions({
	schemaOptions: { ...modelsOptions }
})
export class Apply {
	@ApiProperty({ description: '操作动作名称' })
	@prop()
	name: string

	@ApiProperty({ description: '操作动作key' })
	@prop()
	action: string

	@ApiProperty({ description: '操作动作是否允许' })
	@prop({ default: true })
	check: boolean

	@ApiProperty({ description: '是否禁用' })
	@prop({ default: false })
	disable: boolean
}
