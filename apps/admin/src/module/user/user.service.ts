import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'
import { User } from 'libs/db/src/models/user.model'
import { LoginDto, CreateDto, UpdateDto } from './user.dto'
import { compareSync } from 'bcryptjs'

@Injectable()
export class UserService {
	constructor(@InjectModel(User) public readonly userModel: ReturnModelType<typeof User>) {}

	//用户登录
	async login(user: LoginDto): Promise<User | null> {
		const response = await this.userModel.findOne({ username: user.username })
		if (response === null || response === undefined) {
			throw new HttpException('username 不存在', HttpStatus.BAD_REQUEST)
		}

		if (response.disable) {
			throw new HttpException('账户已被禁用，请联系超级管理员解禁', HttpStatus.UNAUTHORIZED)
		}

		if (!compareSync(user.password, response.password)) {
			throw new HttpException('password 错误', HttpStatus.BAD_REQUEST)
		}

		return await this.userModel.findById(response.id, { password: 0, disable: 0 })
	}

	//创建用户
	async create(user: CreateDto): Promise<User> {
		try {
			if (await this.userModel.findOne({ username: user.username })) {
				throw new HttpException('该用户名已注册', HttpStatus.BAD_REQUEST)
			}

			const response = await new this.userModel(user).save()

			return await this.userModel.findById(response.id, { password: 0, disable: 0 })
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//获取所有用户列表
	async findAll(): Promise<User[] | null> {
		return await this.userModel.find({}, { password: 0 })
	}

	//获取用户详情
	async findOne(id: string): Promise<User | null> {
		try {
			const response = await this.userModel.findById(id, { password: 0 })
			if (response === null || response === undefined) {
				throw new HttpException('id 错误', HttpStatus.BAD_REQUEST)
			}
			return response
		} catch (error) {
			throw new HttpException('id 错误', HttpStatus.BAD_REQUEST)
		}
	}

	//修改用户信息
	async update(user: UpdateDto): Promise<any> {
		try {
			const response = await this.userModel.updateOne({ _id: user.id }, user)
			if (response.nModified === 0) {
				throw new HttpException('id 错误', HttpStatus.BAD_REQUEST)
			}
			return await this.userModel.findById(user.id, { password: 0 })
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//删除用户
	async remove(id: string) {
		try {
			const response = await this.userModel.deleteOne({ _id: id })
			if (response.deletedCount === 0) {
				throw new HttpException('id 错误', HttpStatus.BAD_REQUEST)
			}
			return response
		} catch (error) {
			throw new HttpException('id 错误', HttpStatus.BAD_REQUEST)
		}
	}
}
