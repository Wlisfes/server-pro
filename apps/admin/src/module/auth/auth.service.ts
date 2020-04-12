import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { StoreService } from '../../service/store/store.service'

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly userService: UserService,
		private readonly storeService: StoreService
	) {}

	//access_token加密
	async sign(id: string) {
		const response = await (await this.userService.userModel.findById(id)).toJSON()

		return this.jwtService.sign({
			username: response.username,
			password: response.password,
			id: response.id
		})
	}

	//access_token解密
	async verify(access_token: string) {
		try {
			//token解密
			const verify = await this.jwtService.verify(access_token)

			//读取用户信息
			// const user = await this.readUser(verify.id)
			const user = await (await this.userService.userModel.findById(verify.id)).toJSON()

			if (user.disable) {
				//验证账号是否被禁用  并需要清空用户缓存信息
				this.storeService.delStore(user.id)
				throw new HttpException('账户已被禁用，请联系超级管理员解禁', HttpStatus.FORBIDDEN)
			}

			if (user.password !== verify.password) {
				//password 已更换 并需要清空用户缓存信息
				this.storeService.delStore(user.id)
				throw new HttpException('password 已更换，请从新登录', HttpStatus.FORBIDDEN)
			}

			return user
		} catch (error) {
			throw new HttpException(
				error.message || 'access_token 错误或已过期',
				error.status || HttpStatus.UNAUTHORIZED
			)
		}
	}

	//读取用户信息
	async readUser(id: string) {
		//缓存读取
		const store = await this.storeService.getStore(id)

		if (!store) {
			//没有缓存需要重数据库重新读取
			const response = await (await this.userService.userModel.findById(id)).toJSON()

			//重新写入缓存 默认有效期6个小时
			await this.storeService.setStore(response.id, response)

			return response
		}

		return store
	}
}
