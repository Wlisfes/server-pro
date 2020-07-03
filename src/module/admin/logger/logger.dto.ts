/*
 * @Author: 情雨随风
 * @Date: 2020-07-02 16:16:54
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-07-03 12:45:37
 * @Description: loggerDto
 */

import { ApiProperty } from '@nestjs/swagger'
import { Allow } from 'class-validator'
import { Type } from 'class-transformer'

export class Logger {
	@Type(() => Number)
	@ApiProperty({ description: '分页数量', example: 5 })
	@Allow()
	limit: number

	@Type(() => Number)
	@ApiProperty({ description: '筛选数量', example: 0 })
	@Allow()
	offset: number
}
