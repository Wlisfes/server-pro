import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'
import { User } from 'libs/db/src/models/user.model'

@Injectable()
export class UserService {
	constructor(@InjectModel(User) private readonly userModel: ReturnModelType<typeof User>) {}

	//获取所有用户
	async findAll(): Promise<User[] | null> {
		return await this.userModel.find()
	}

	//获取用户详情
	async findOne(id: string): Promise<User | null> {
		return this.userModel.findById(id)
	}

	//新增用户
	async create(user): Promise<User> {
		const createUser = new this.userModel(user)
		return await createUser.save()
	}

	//删除用户
	async remove(id: string) {
		await this.userModel.deleteOne({ _id: id })
	}
}
