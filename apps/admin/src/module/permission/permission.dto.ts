import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { Apply } from '@libs/db/models/apply.model'

export class CreateDto {
	@ApiProperty({ description: '权限模块唯一识别码', example: 'user' })
	@IsNotEmpty({ message: 'permission_id 必填' })
	permission_id: string

	@ApiProperty({ description: '权限模块名称', example: '用户管理' })
	@IsNotEmpty({ message: 'permission_name 必填' })
	permission_name: string

	@ApiProperty({ description: '权限模块描述', example: '操作用户账号' })
	@IsNotEmpty({ message: 'description 必填' })
	description: string

	@ApiProperty({ description: '权限模块是否禁用', example: false })
	disable: boolean

	@ApiProperty({
		description: '权限模块拥有的操作列表',
		example: [
			{
				name: '新增',
				action: 'create',
				check: true,
				disable: false
			}
		]
	})
	permission: Apply[]
}

export class DeletePermissionDto {
	@ApiProperty({ description: '权限模块id', example: '5e88aab08f5c3936cc73e32a' })
	@IsNotEmpty({ message: 'id 必填' })
	id: string
}
