import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

interface Add {
	name: string
	check: boolean
}

export class CreateDto {
	@ApiProperty({ description: '角色唯一识别码', example: 'user' })
	@IsNotEmpty({ message: 'role_id 必填' })
	role_id: string

	@ApiProperty({ description: '角色名称', example: '用户管理' })
	@IsNotEmpty({ message: 'role_name 必填' })
	role_name: string

	@ApiProperty({
		description: '新增权限',
		example: {
			name: '新增',
			check: false
		}
	})
	@IsNotEmpty({ message: 'add 必填' })
	add: Add

	@ApiProperty({ description: '角色是否禁用', example: false })
	disable: boolean
}
