import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'
import { StoreService } from '../store/store.service'
import { SignService } from '../sign/sign.service'
import { loginUserDto, createUserDto, changeUserDto, updateUserDto, updateUserAvatarDto } from './user.dto'
import { compareSync } from 'bcryptjs'
import { User } from '../db/models/user'
import { Role } from '../db/models/role'
import { UserRole } from '../db/models/userRole'
import * as _ from 'lodash'

@Injectable()
export class UserService {
	constructor(
		private readonly storeService: StoreService,
		private readonly signService: SignService,
		@InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
		@InjectModel(Role) private readonly roleModel: ReturnModelType<typeof Role>,
		@InjectModel(UserRole) private readonly userRoleModel: ReturnModelType<typeof UserRole>
	) {}

	//用户登陆
	async loginUser(user: loginUserDto): Promise<User> {
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

		const resUser = await (await this.userModel.findById(response.id, { password: 0, status: 0 })).toJSON()

		//加密用户信息生成access_token
		const access_token = await this.signService.sign({
			id: response.id,
			username: response.username,
			password: response.password
		})

		return { access_token, ...resUser }
	}

	//注册用户
	async createUser(user: createUserDto): Promise<User> {
		try {
			if (await this.userModel.findOne({ username: user.username })) {
				throw new HttpException('该用户名已注册', HttpStatus.BAD_REQUEST)
			}
			//查找游客角色
			const role = await this.roleModel.findOne(
				{ role_key: 'visitor' },
				{ _id: 0, update_time: 0, create_time: 0 }
			)
			//存储用户信息
			const response = await new this.userModel(user).save()

			if (role) {
				//若存在游客角色、则存储一个对应此用户的游客信息
				const roles = await new this.userRoleModel({
					auth: role.auth,
					role_key: role.role_key,
					role_name: role.role_name,
					status: role.status,
					role_uid: response.id
				}).save()

				//把存储好的游客信息关联到此用户
				await this.userModel.updateOne({ _id: response.id }, { ...user, roles })
			}

			return await this.findUserOneRoles(response.id, { password: 0 })
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//根据id获取用户信息以及用户角色权限
	async findUserOneRoles(id: string, condition?: { status?: number; password?: number; [key: string]: number }) {
		return await this.userModel.findById(id, condition).populate('roles')
	}

	//获取所有用户列表以及用户角色权限
	async findUserAll(): Promise<User[]> {
		return await this.userModel
			.find({}, { password: 0 })
			.sort({ create_time: -1 })
			.populate('roles', { create_time: 0, update_time: 0 })
			.exec()
	}

	//切换用户状态
	async changeUser(params: changeUserDto) {
		try {
			const response = await this.userModel.updateOne({ _id: params.id }, { status: params.status })

			if (response.nModified === 1) {
				return await this.findUserOneRoles(params.id, { password: 0 })
			}
			throw new HttpException('id 错误', HttpStatus.BAD_REQUEST)
		} catch (error) {
			throw new HttpException('id 错误', HttpStatus.BAD_REQUEST)
		}
	}

	//修改用户信息
	async updateUser(params: updateUserDto) {
		try {
			if (params.mobile && !/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(params.mobile as string)) {
				throw new HttpException('mobile 错误', HttpStatus.BAD_REQUEST)
			}

			const response = await this.userModel.updateOne(
				{ _id: params.id },
				{
					nickname: params.nickname,
					email: params.email || null,
					mobile: (params.mobile as number) || null,
					status: params.status || 0
				}
			)

			if (response.nModified === 1) {
				await this.userRoleModel.updateOne({ role_uid: params.id }, { ...params.roles })
				return await this.findUserOneRoles(params.id, { password: 0 })
			}
			throw new HttpException('id 错误', HttpStatus.BAD_REQUEST)
		} catch (error) {
			throw new HttpException(error.message || 'id 错误', HttpStatus.BAD_REQUEST)
		}
	}

	//修改用户头像
	async updateUserAvatar(params: updateUserAvatarDto) {
		try {
			if (!(await this.userModel.findById(params.id))) {
				throw new HttpException('id 错误', HttpStatus.BAD_REQUEST)
			}
			const response = await this.userModel.updateOne({ _id: params.id }, { avatar: params.avatar })

			if (response.nModified === 1) {
				return await this.findUserOneRoles(params.id, { password: 0 })
			}
			throw new HttpException('id 错误', HttpStatus.BAD_REQUEST)
		} catch (error) {
			throw new HttpException(error.message || 'id 错误', HttpStatus.BAD_REQUEST)
		}
	}

	//删除用户
	async deleteUser(id: string): Promise<any> {
		try {
			const response = await this.userModel.remove({ _id: id })

			if (response.deletedCount === 1) {
				return response
			}
			throw new HttpException('id 错误', HttpStatus.BAD_REQUEST)
		} catch (error) {
			throw new HttpException('id 错误', HttpStatus.BAD_REQUEST)
		}
	}
}
