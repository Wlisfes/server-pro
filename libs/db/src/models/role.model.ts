/*
 * @Author: 情雨随风
 * @Date: 2020-04-06 10:36:28
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-04-06 22:54:58
 * @Description: 角色表
 */

import { prop, modelOptions, DocumentType } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'
import { modelsOptions } from '../utils'

interface Add {
	name: string
	check: boolean
}

@modelOptions({
	schemaOptions: { ...modelsOptions }
})
export class Role {
	@ApiProperty({ description: '角色唯一识别码' })
	@prop()
	role_id: string

	@ApiProperty({ description: '角色名称' })
	@prop()
	role_name: string

	@prop({ default: false })
	add: Add

	@ApiProperty({ description: '角色是否禁用' })
	@prop({ default: false })
	disable: boolean
}
