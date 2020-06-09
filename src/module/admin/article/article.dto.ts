/*
 * @Author: 情雨随风
 * @Date: 2020-06-07 23:25:56
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-07 23:43:10
 * @Description: articleDto
 */

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsNumber, IsIn, Allow, IsArray } from 'class-validator'
import { Type } from 'class-transformer'

export class Article {
	@Type(() => String)
	@ApiProperty({ description: '文字标题', example: '这是一段标题...' })
	@IsNotEmpty({ message: 'title 必填' })
	@IsString({ message: 'title is string' })
	title: string

	@Type(() => String)
	@ApiProperty({ description: '文章描述', example: '这是一段描述...' })
	@IsNotEmpty({ message: 'description 必填' })
	@IsString({ message: 'description is string' })
	description: string

	@Type(() => String)
	@ApiProperty({ description: '文章封面', example: 'http://xxx/xx.png' })
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
	@IsNotEmpty({ message: 'text 必填' })
	@IsString({ message: 'text is string' })
	text: string
}

export class ArticleIdDto {
	@Type(() => Number)
	@ApiProperty({ description: '文章id', example: 1 })
	@IsNotEmpty({ message: 'id 必填' })
	@IsNumber({}, { message: 'id is number' })
	id: number
}

export class FindArticleDto {
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

export class CreateArticleDto extends Article {
	@ApiProperty({
		description: '标签id',
		example: [1, 2, 3, 4, 5]
	})
	@IsArray()
	@Type(() => Number)
	tag: number[]
}

export class UpdateArticleDto extends Article {
	@Type(() => Number)
	@ApiProperty({ description: '文章id', example: 1 })
	@IsNotEmpty({ message: 'id 必填' })
	@IsNumber({}, { message: 'id is number' })
	id: number

	@Type(() => Number)
	@ApiProperty({ description: '文章状态', example: 1 })
	@IsNumber({}, { message: 'status is number' })
	@IsIn([0, 1], { message: 'status 不合法' })
	status: number

	@ApiProperty({ description: '标签id', example: [1, 2, 3, 4, 5] })
	@IsArray()
	@Type(() => Number)
	tag: number[]
}
