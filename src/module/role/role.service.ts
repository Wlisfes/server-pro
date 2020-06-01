import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RoleEntity } from '@/entity/role.entity'
import { RoleId, CreateRoleDto, UpdateRoleDto, DeleteRoleDto, CutoverRoleDto } from './role.dto'

@Injectable()
export class RoleService {
	constructor(@InjectRepository(RoleEntity) private readonly roleModel: Repository<RoleEntity>) {}

	//创建角色
	async createRole(params: CreateRoleDto) {
		try {
			if (await this.roleModel.findOne({ where: { role_key: params.role_key, user: null } })) {
				throw new HttpException(`role_key: ${params.role_key} 已存在`, HttpStatus.BAD_REQUEST)
			}

			if (await this.roleModel.findOne({ where: { role_name: params.role_name, user: null } })) {
				throw new HttpException(`role_name: ${params.role_name} 已存在`, HttpStatus.BAD_REQUEST)
			}

			const role = await this.roleModel.create({
				role_key: params.role_key,
				role_name: params.role_name,
				status: params.status || 1
			})
			return await this.roleModel.save(role)
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//获取角色列表
	async findRoleAll() {
		return await this.roleModel.find({ where: { user: null }, order: { id: 'DESC' } })
	}

	//获取角色详情
	async findIdRole(params: RoleId) {
		return await this.roleModel.findOne({ where: { id: params.id } })
	}

	//修改角色
	async updateRole(params: UpdateRoleDto) {
		try {
			const key = await this.roleModel.findOne({ where: { role_key: params.role_key, user: null } })
			if (key && key.id !== params.id) {
				throw new HttpException(`role_key: ${params.role_key} 已存在`, HttpStatus.BAD_REQUEST)
			}

			const name = await this.roleModel.findOne({ where: { role_name: params.role_name, user: null } })
			if (name && name.id !== params.id) {
				throw new HttpException(`role_name: ${params.role_name} 已存在`, HttpStatus.BAD_REQUEST)
			}

			await this.roleModel.update({ id: params.id }, params)

			return await this.roleModel.findOne({ where: { id: params.id } })
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//切换权限状态
	async cutoverRole(params: CutoverRoleDto) {
		try {
			const role = await this.roleModel.findOne({ where: { id: params.id } })
			if (role) {
				await this.roleModel.update({ id: params.id }, { status: role.status ? 0 : 1 })
				return await this.roleModel.findOne({ where: { id: params.id } })
			}
			throw new HttpException(`id: ${params.id} 错误`, HttpStatus.BAD_REQUEST)
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//删除角色
	async deleteRole(params: DeleteRoleDto) {
		const role = await this.roleModel.delete({ id: params.id })
		if (role.affected === 0) {
			throw new HttpException(`id: ${params.id} 错误`, HttpStatus.BAD_REQUEST)
		}
		return role
	}
}
