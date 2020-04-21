import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'
import { User } from '@libs/db/models/user'
import { loginUserDto, createUserDto } from './user.dto'
import { compareSync } from 'bcryptjs'

@Injectable()
export class UserService {
	constructor(@InjectModel(User) private readonly userModel: ReturnModelType<typeof User>) {}

	//用户登陆
	async loginUser(user: loginUserDto): Promise<User | null> {
		const response = await this.userModel.findOne({ username: user.username })
		if (response === null || response === undefined) {
			throw new HttpException('username 不存在', HttpStatus.BAD_REQUEST)
		}

		if (!response.status) {
			throw new HttpException('账户已被禁用，请联系超级管理员解禁', HttpStatus.FORBIDDEN)
		}

		if (!compareSync(user.password, response.password)) {
			throw new HttpException('password 错误', HttpStatus.BAD_REQUEST)
		}

		return await this.userModel.findById(response.id, { password: 0, status: 0 })
	}

	//注册用户
	async createUser(user: createUserDto): Promise<User> {
		try {
			if (await this.userModel.findOne({ username: user.username })) {
				throw new HttpException('该用户名已注册', HttpStatus.BAD_REQUEST)
			}
			const response = await new this.userModel(user).save()

			return await (await this.userModel.findById(response.id, { password: 0, status: 0 })).toJSON()
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//获取所有用户列表
	async findUserAll(): Promise<User[]> {
		return await this.userModel.find({}, { password: 0 }).exec()
	}

	//删除用户
	async deleteUser(id: string): Promise<any> {
		return await this.userModel.remove({ _id: id })
	}
}
