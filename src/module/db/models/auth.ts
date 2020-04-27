/*
 * @Date: 2020-04-22 13:25:31
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-04-24 10:29:39
 * @Description: 权限模块表
 */

import { prop, modelOptions, DocumentType } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsIn, IsBoolean, IsArray } from 'class-validator'
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
	@IsIn([0, 1], { message: 'status 参数不合法' })
	status: number
}

@modelOptions({
	schemaOptions: { ...modelsOptions }
})
export class Auth {
	@ApiProperty({ description: '模块名称' })
	@prop()
	@IsNotEmpty({ message: 'auth_name 必填' })
	@IsString({ message: 'auth_name 必须为string' })
	auth_name: string

	@ApiProperty({ description: '模块key' })
	@prop()
	@IsNotEmpty({ message: 'auth_key 必填' })
	@IsString({ message: 'auth_key 必须为string' })
	auth_key: string

	@ApiProperty({ description: '模块状态' })
	@prop({ default: 1 })
	@IsNotEmpty({ message: 'status 必填' })
	@IsIn([0, 1], { message: 'status 参数不合法' })
	status: number

	@ApiProperty({ description: '是否全选' })
	@prop({ default: false })
	@IsNotEmpty({ message: 'all 必填' })
	@IsBoolean({ message: 'all 必须为boolean' })
	all: boolean

	@prop()
	@IsArray({ message: 'apply 格式错误' })
	apply: Array<Apply>
}
