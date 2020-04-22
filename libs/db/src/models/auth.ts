/*
 * @Date: 2020-04-22 13:25:31
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-04-22 15:28:34
 * @Description: 权限模块表
 */

import { prop, modelOptions, DocumentType, Ref } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsNumber } from 'class-validator'
import { modelsOptions } from '../utils'

export type AuthDocument = DocumentType<Auth>

export class Apply {
	@ApiProperty({ description: '操作名称' })
	@prop()
	@IsNotEmpty()
	@IsString()
	apply_name: string

	@ApiProperty({ description: '操作key' })
	@prop()
	@IsNotEmpty()
	@IsString()
	apply_key: string

	@ApiProperty({ description: '操作状态' })
	@prop({ default: 1 })
	@IsString()
	@IsNumber()
	status: number
}

@modelOptions({
	schemaOptions: { ...modelsOptions }
})
export class Auth {
	@ApiProperty({ description: '模块名称' })
	@prop()
	@IsNotEmpty()
	@IsString()
	auth_name: string

	@ApiProperty({ description: '模块key' })
	@prop()
	@IsNotEmpty()
	@IsString()
	auth_key: string

	@ApiProperty({ description: '模块状态' })
	@prop({ default: 1 })
	@IsNotEmpty()
	@IsNumber()
	status: number

	@ApiProperty({ description: '是否全选' })
	@prop({ default: false })
	@IsNotEmpty()
	@IsString()
	all: boolean

	@prop()
	apply: Array<Apply>
}
