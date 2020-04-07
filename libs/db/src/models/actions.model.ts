/*
 * @Author: 情雨随风
 * @Date: 2020-04-07 23:42:09
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-04-08 00:18:10
 * @Description: 权限模块的子表  储存权限模块所拥有的操作权限
 */

import { prop, modelOptions, DocumentType, Ref } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'
import { modelsOptions } from '../utils'
import { Permission } from './permission.model'

export type UserDocument = DocumentType<Actions>

@modelOptions({
	schemaOptions: { ...modelsOptions }
})
export class Actions {
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

	@ApiProperty({ description: '所属哪个权限模块' })
	@prop({ ref: 'Permission' })
	apply_id: Ref<Permission>
}
