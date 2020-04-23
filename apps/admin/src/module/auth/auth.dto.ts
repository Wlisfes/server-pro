/*
 * @Date: 2020-04-23 13:53:12
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-04-23 15:52:18
 * @Description: AuthDto
 */

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsIn } from 'class-validator'

export class deleteAuthDto {
	@ApiProperty({ description: '权限模块id', example: '5e9eab973268ca04bcb3285b' })
	@IsNotEmpty({ message: 'id 必填' })
	@IsString()
	id: string
}

export class changeAuthDto extends deleteAuthDto {
	@ApiProperty({ description: '权限模块状态', example: 1 })
	@IsNotEmpty({ message: 'status 必填' })
	@IsIn([0, 1], { message: 'status 参数不合法' })
	status: number
}
