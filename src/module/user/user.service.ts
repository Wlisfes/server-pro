import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '@/entity/user.entity'

@Injectable()
export class UserService {
	constructor(@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>) {}

	public async createUser() {
		const user = await this.userModel.create({
			username: 'admin',
			password: '3633'
		})

		return await this.userModel.save(user)
	}

	public async findUserAll() {
		return await this.userModel.find()
	}
}
