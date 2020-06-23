/*
 * @Date: 2020-06-23 14:15:34
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-23 16:13:45
 * @Description: notesDto
 */

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsNumber, IsIn, Allow, IsArray } from 'class-validator'
import { Type } from 'class-transformer'

export class Notes {
	@Type(() => String)
	@ApiProperty({ description: '笔记标题', example: '这是一段标题...' })
	@IsNotEmpty({ message: 'title 必填' })
	@IsString({ message: 'title is string' })
	title: string

	@Type(() => String)
	@ApiProperty({ description: '笔记封面', example: 'http://xxx/xx.png' })
	@IsNotEmpty({ message: 'picUrl 必填' })
	@IsString({ message: 'picUrl is string' })
	picUrl: string

	@Type(() => String)
	@ApiProperty({ description: '原始内容 用于回显编辑器', example: '这是一段原始内容...' })
	@IsNotEmpty({ message: 'content 必填' })
	@IsString({ message: 'content is string' })
	content: string

	@Type(() => String)
	@ApiProperty({ description: '文本内容 用于页面加载', example: '这是一段文本内容...' })
	@IsNotEmpty({ message: 'html 必填' })
	@IsString({ message: 'html is string' })
	html: string

	@Type(() => String)
	@ApiProperty({ description: '代码风格', example: 'oneDark' })
	@IsNotEmpty({ message: 'themeName 必填' })
	@IsString({ message: 'themeName is string' })
	themeName: string
}

export class NotesIdDto {
	@Type(() => Number)
	@ApiProperty({ description: '笔记id', example: 1 })
	@IsNotEmpty({ message: 'id 必填' })
	@IsNumber({}, { message: 'id is number' })
	id: number
}

export class CreateNotesDto extends Notes {
	@ApiProperty({ description: '标签id', example: [1, 2, 3, 4, 5] })
	@IsArray()
	@Type(() => Number)
	tag: number[]

	@Type(() => Number)
	@ApiProperty({ description: '状态 参数可选 默认为1', example: 1 })
	@Allow()
	status?: number
}

export class FindNotesDto {
	@Type(() => Number)
	@ApiProperty({ description: '作者uid 参数可选', example: 1590938177274 })
	@Allow()
	uid?: number

	@Type(() => Number)
	@ApiProperty({ description: '状态 参数可选', example: 1 })
	@Allow()
	status?: number

	@Type(() => String)
	@ApiProperty({ description: '时间段 参数可选', example: '2020-01-01' })
	@Allow()
	createTime?: string
}

export class UpdateNotesDto extends Notes {
	@Type(() => Number)
	@ApiProperty({ description: '笔记id', example: 1 })
	@IsNotEmpty({ message: 'id 必填' })
	@IsNumber({}, { message: 'id is number' })
	id: number

	@Type(() => Number)
	@ApiProperty({ description: '笔记状态', example: 1 })
	@IsNumber({}, { message: 'status is number' })
	@IsIn([0, 1], { message: 'status 不合法' })
	status: number

	@ApiProperty({ description: '标签id', example: [1, 2, 3, 4, 5] })
	@IsArray()
	@Type(() => Number)
	tag: number[]
}
