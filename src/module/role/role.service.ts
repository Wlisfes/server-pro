import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '@/entity/user.entity'
import { RoleEntity } from '@/entity/role.entity'

@Injectable()
export class RoleService {
	constructor(
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
		@InjectRepository(RoleEntity) private readonly roleModel: Repository<RoleEntity>
	) {}

	async createRole() {
		try {
			const role = await this.roleModel
				.createQueryBuilder('role')
				.where('role.role_key = :role_key', { role_key: 'visitor' })
				.andWhere('role.role_name = :role_name', { role_name: '游客' })
				.getOne()

			// const user = await this.roleModel.create({
			// 	role_key: 'visitor',
			// 	role_name: '游客'
			// })
			// return await this.roleModel.save(user)
			return role
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	async findRoleAll() {
		return this.roleModel.find({ where: { user: null }, relations: ['user'] })
	}
}
