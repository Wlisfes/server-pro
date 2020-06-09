/*
 * @Author: 情雨随风
 * @Date: 2020-06-08 23:06:42
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-08 23:12:30
 * @Description: projectDto
 */

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsNumber, IsIn, Allow, IsArray } from 'class-validator'
import { Type } from 'class-transformer'

export class ProjectDto {
	@Type(() => String)
	@ApiProperty({ description: '项目标题', example: '这是一段标题...' })
	@IsNotEmpty({ message: 'title 必填' })
	@IsString({ message: 'title is string' })
	title: string

	@Type(() => String)
	@ApiProperty({ description: '项目描述', example: '这是一段描述...' })
	@IsNotEmpty({ message: 'description 必填' })
	@IsString({ message: 'description is string' })
	description: string

	@Type(() => String)
	@ApiProperty({ description: '项目封面', example: 'http://xxx/xx.png' })
	@IsNotEmpty({ message: 'picUrl 必填' })
	@IsString({ message: 'picUrl is string' })
	picUrl: string

	@Type(() => String)
	@ApiProperty({ description: '项目地址', example: 'https://github/xxxx' })
	@IsNotEmpty({ message: 'github 必填' })
	@IsString({ message: 'github is string' })
	github: string

	@Type(() => String)
	@ApiProperty({ description: '访问地址', example: 'http://xxx.com' })
	@Allow()
	accessUrl: string
}

export class CreateProjectDto extends ProjectDto {
	@ApiProperty({
		description: '标签id',
		example: [1, 2, 3, 4, 5]
	})
	@IsArray()
	@Type(() => Number)
	tag: number[]
}

export class ProjectIdDto {
	@Type(() => Number)
	@ApiProperty({ description: '项目id', example: 1 })
	@IsNotEmpty({ message: 'id 必填' })
	@IsNumber({}, { message: 'id is number' })
	id: number
}

export class FindProjectDto {
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

export class UpdateProjectDto extends ProjectDto {
	@Type(() => Number)
	@ApiProperty({ description: '项目id', example: 1 })
	@IsNotEmpty({ message: 'id 必填' })
	@IsNumber({}, { message: 'id is number' })
	id: number

	@Type(() => Number)
	@ApiProperty({ description: '项目状态', example: 1 })
	@IsNumber({}, { message: 'status is number' })
	@IsIn([0, 1], { message: 'status 不合法' })
	status: number

	@ApiProperty({ description: '标签id', example: [1, 2, 3, 4, 5] })
	@IsArray()
	@Type(() => Number)
	tag: number[]
}
