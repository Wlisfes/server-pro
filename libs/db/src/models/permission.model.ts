/*
 * @Author: 情雨随风
 * @Date: 2020-04-06 11:38:24
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-04-08 00:18:06
 * @Description: 权限表
 */

import { prop, arrayProp, Ref, modelOptions, DocumentType } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'
import { Actions } from './actions.model'
import { modelsOptions } from '../utils'

export type UserDocument = DocumentType<Permission>

@modelOptions({
	schemaOptions: { ...modelsOptions }
})
export class Permission {
	@ApiProperty({ description: '权限模块唯一识别码' })
	@prop()
	permission_id: string

	@ApiProperty({ description: '权限模块名称' })
	@prop()
	permission_name: string

	@ApiProperty({ description: '模块是否禁用' })
	@prop({ default: false })
	disable: boolean

	@ApiProperty({ description: '描述' })
	@prop()
	description: string

	@ApiProperty({ description: '权限模块拥有的操作列表' })
	@arrayProp({
		ref: 'Actions',
		localField: '_id',
		foreignField: 'apply_id'
	})
	permission: Ref<Actions>[]
}
