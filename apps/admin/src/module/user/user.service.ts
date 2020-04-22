import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'
import { User } from '@libs/db/models/user'
import { StoreService } from '../store/store.service'
import { SignService } from '../sign/sign.service'
import { loginUserDto, createUserDto } from './user.dto'
import { compareSync } from 'bcryptjs'
import { Role } from '@libs/db/models/role'

@Injectable()
export class UserService {
	constructor(
		private readonly storeService: StoreService,
		private readonly signService: SignService,
		@InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
		@InjectModel(Role) private readonly roleModel: ReturnModelType<typeof Role>
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
			const response = await new this.userModel(user).save()

			// const auth = [
			// 	{
			// 		auth_name: '用户管理',
			// 		apply: [
			// 			{
			// 				apply_name: '新增',
			// 				apply: 'add',
			// 				status: 1
			// 			},
			// 			{
			// 				apply_name: '删除',
			// 				apply: 'delete',
			// 				status: 1
			// 			}
			// 		]
			// 	},
			// 	{
			// 		auth_name: '文章管理',
			// 		apply: [
			// 			{
			// 				apply_name: '修改',
			// 				apply: 'update',
			// 				status: 1
			// 			},
			// 			{
			// 				apply_name: '删除',
			// 				apply: 'delete',
			// 				status: 1
			// 			}
			// 		]
			// 	}
			// ]
			// const role = await new this.roleModel({
			// 	role_name: '项目管理员',
			// 	role_uid: response.id,
			// 	auth: auth
			// }).save()

			// await this.userModel.updateOne(
			// 	{ _id: response.id },
			// 	{
			// 		...user,
			// 		roles: role
			// 	}
			// )

			return await this.findUserOneRoles(response.id, { status: 0, password: 0 })
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//根据id获取用户信息以及用户角色权限
	async findUserOneRoles(id: string, condition?: { status?: number; password?: number; [key: string]: number }) {
		return await (await this.userModel.findById(id, condition).populate('roles')).toJSON()
	}

	//获取所有用户列表以及用户角色权限
	async findUserAll(): Promise<User[]> {
		return await this.userModel
			.find({}, { password: 0 })
			.populate('roles', { create_time: 0, update_time: 0 })
			.exec()
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
