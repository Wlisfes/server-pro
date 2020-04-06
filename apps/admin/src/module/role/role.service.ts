import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'
import { Role } from '@libs/db/models/role.model'
import { Permission } from '@libs/db/models/permission.model'
import { Apply } from '@libs/db/models/apply.model'

@Injectable()
export class RoleService {
	constructor(
		@InjectModel(Role) public readonly roleModel: ReturnModelType<typeof Role>,
		@InjectModel(Apply) public readonly applyModel: ReturnModelType<typeof Apply>,
		@InjectModel(Permission) public readonly permissionModel: ReturnModelType<typeof Permission>
	) {}

	//创建角色
	async create(role: Role): Promise<Role | any> {
		try {
			if (await this.roleModel.findOne({ role_id: role.role_id })) {
				throw new HttpException('role_id 已存在', HttpStatus.BAD_REQUEST)
			}
			const response = await new this.roleModel(role).save()
			return await this.roleModel.findById(response.id)
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//获取所有用户列表
	async findAll(): Promise<Role[]> {
		return await this.roleModel.find()
	}
}
