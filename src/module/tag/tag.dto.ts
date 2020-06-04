/*
 * @Date: 2020-06-04 09:32:04
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-04 16:16:59
 * @Description: tagDto
 */

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, ValidateNested, IsObject, IsArray, Allow, IsNumber, IsIn } from 'class-validator'
import { Type } from 'class-transformer'

export class Tag {
	@Type(() => String)
	@ApiProperty({ description: '标签名称', example: 'Vue' })
	@IsNotEmpty({ message: 'name 必填' })
	@IsString({ message: 'name is string' })
	name: string

	@Type(() => String)
	@ApiProperty({ description: '标签颜色', example: '#13c2c2' })
	@IsNotEmpty({ message: 'color 必填' })
	@IsString({ message: 'color is string' })
	color: string
}

export class TagId {
	@Type(() => Number)
	@ApiProperty({ description: '标签id', example: 1 })
	@IsNotEmpty({ message: 'id 必填' })
	@IsNumber({}, { message: 'id is number' })
	id: number
}

export class CreateTagDto extends Tag {}

export class UpdateTagDto extends Tag {
	@Type(() => Number)
	@ApiProperty({ description: '标签id', example: 1 })
	@IsNotEmpty({ message: 'id 必填' })
	@IsNumber({}, { message: 'id is number' })
	id: number

	@Type(() => Number)
	@ApiProperty({ description: '标签状态', example: 1 })
	@IsNumber({}, { message: 'status is number' })
	@IsIn([0, 1], { message: 'status 不合法' })
	status: number
}
