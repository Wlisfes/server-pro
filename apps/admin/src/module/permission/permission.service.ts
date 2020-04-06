import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'
import { Permission } from '@libs/db/models/permission.model'
import { CreateDto } from './permission.dto'

@Injectable()
export class PermissionService {
	constructor(@InjectModel(Permission) public readonly permissionModel: ReturnModelType<typeof Permission>) {}

	//创建权限模块
	async create(permission: CreateDto): Promise<Permission | any> {
		try {
			console.log(permission)

			return true
		} catch (error) {}

		// return await this.permissionModel.findById('')
	}

	//获取所有权限模块列表
	async findAll(): Promise<Permission[]> {
		return await this.permissionModel.find()
	}
}
