import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'
import { Role } from '../db/models/role'
import { AuthInter, updateRoleDto, createRoleDto } from './role.dto'

@Injectable()
export class RoleService {
	constructor(@InjectModel(Role) private readonly roleModel: ReturnModelType<typeof Role>) {}

	//验证auth数据
	private everyAuth(auth: Array<AuthInter>) {
		const isString = (key: string) => key !== '' && typeof key === 'string'
		return auth.every(k => {
			if (isString(k.auth_key) && isString(k.auth_name) && typeof k.all === 'boolean') {
				if (Array.isArray(k.apply)) {
					return k.apply.every(
						v => (isString(v.apply_key) && isString(v.apply_name) && v.status === 0) || v.status === 1
					)
				}
				return false
			}
			return false
		})
	}

	//获取所有角色列表
	async findRoleAll(): Promise<Role[]> {
		return await this.roleModel
			.find({ role_uid: null }, { role_uid: 0 })
			.sort({ create_time: -1 })
			.exec()
	}

	//新增角色
	async createRole(params: createRoleDto) {
		try {
			if (await this.roleModel.findOne({ role_key: params.role_key })) {
				throw new HttpException(`${params.role_key} 已存在`, HttpStatus.BAD_REQUEST)
			}
			if (!this.everyAuth(params.auth)) {
				throw new HttpException('auth 格式错误', HttpStatus.BAD_REQUEST)
			}
			return await new this.roleModel(params).save()
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//删除角色
	async deleteRole(id: string) {
		try {
			const response = await this.roleModel.deleteOne({ _id: id })

			if (response.deletedCount === 1) {
				return response
			}
			throw new HttpException('id 错误', HttpStatus.BAD_REQUEST)
		} catch (error) {
			throw new HttpException('id 错误', HttpStatus.BAD_REQUEST)
		}
	}

	//切换角色状态
	async changeRole(params: { id: string; status: number }) {
		try {
			const response = await this.roleModel.updateOne({ _id: params.id }, { status: params.status })

			if (response.nModified === 1) {
				return response
			}
			throw new HttpException('id 错误', HttpStatus.BAD_REQUEST)
		} catch (error) {
			throw new HttpException('id 错误', HttpStatus.BAD_REQUEST)
		}
	}

	//修改角色
	async updateRole(params: updateRoleDto) {
		try {
			if (!this.everyAuth(params.auth)) {
				throw new HttpException('auth 格式错误', HttpStatus.BAD_REQUEST)
			}
			const response = await this.roleModel.updateOne({ _id: params.id }, params)

			if (response.nModified === 1) {
				return await this.roleModel.findById(params.id)
			}
			throw new HttpException('id 错误', HttpStatus.BAD_REQUEST)
		} catch (error) {
			throw new HttpException(error.message || 'id 错误', HttpStatus.BAD_REQUEST)
		}
	}
}
