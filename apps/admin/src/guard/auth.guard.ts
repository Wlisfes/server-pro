import { Injectable, CanActivate, SetMetadata, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { StoreService } from '../module/store/store.service'
import { UserService } from '../module/user/user.service'
import { SignService } from '../module/sign/sign.service'

interface Roles {
	role: string
	apply: string[]
}

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly userService: UserService,
		private readonly storeService: StoreService,
		private readonly signService: SignService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()
		const roles = this.reflector.get<Roles>('roles', context.getHandler())
		const auth = this.reflector.get<boolean>('auth', context.getHandler())

		if (auth) {
			//验证access_token登录
			const access_token = request.headers['access_token']

			if (!access_token) {
				throw new HttpException('未登陆', HttpStatus.UNAUTHORIZED)
			}

			//access_token解密
			const ifyUser = await this.signService.verify(access_token)

			//查看内存中是否缓存有access_token对应的用户信息
			if (await this.storeService.getStore('user')) {
				request.user = await this.storeService.getStore('user')
			} else {
				//从数据库查询access_token对应的用户信息
				const user = await this.userService.findUserOneRoles(ifyUser.id)

				//把用户信息存入内存
				await this.storeService.setStore('user', user)

				request.user = user
			}
		}

		if (roles) {
			//验证权限
			const user = request.user

			console.log(user)
			console.log(roles, roles.apply.includes('admin'))
		}

		return true
	}
}

//登录守卫   使用Auth守卫的接口会验证登录
export const AuthUser = (auth: boolean) => SetMetadata('auth', auth)

//角色守卫   使用了Roles守卫的接口会验证角色
export const AuthRoles = (roles: Roles) => SetMetadata('roles', roles)
