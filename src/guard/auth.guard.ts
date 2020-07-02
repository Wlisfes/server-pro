import { Injectable, CanActivate, SetMetadata, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { SignService } from '@/common/sign/sign.service'
import { UserService } from '@/module/admin/user/user.service'
import { StoreService } from '@/common/store/store.service'
import { User } from '@/module/admin/user/user.dto'

interface Role {
	key: string
	apply: 'create' | 'update' | 'delete' | 'get' | 'import' | 'export' | 'query'
}

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly signService: SignService,
		private readonly userService: UserService,
		private readonly storeService: StoreService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()
		const auth = this.reflector.get<boolean>('auth', context.getHandler())
		const role = this.reflector.get<Role>('role', context.getHandler())

		//ipv4挂载
		request.ipv4 = request.headers['x-forwarded-for'] || request.headers['x-real-ip'] || '127.0.0.1'

		//验证是否登录
		if (auth) {
			const token = request.headers['access-token'] //读取headers中的access-token
			if (!token) {
				throw new HttpException('未登陆', HttpStatus.UNAUTHORIZED)
			}

			const ifyUser = await this.signService.verify(token) //解密token
			const store = await this.storeService.getStore(String(ifyUser.uid)) //读取缓存
			if (store) {
				request.user = store //user信息挂载request向下传递
			} else {
				const newUser = await this.userService.findUidUser(ifyUser.uid)
				if (!newUser || newUser.status !== 1) {
					if (!newUser) {
						throw new HttpException('账户不存在', HttpStatus.FORBIDDEN)
					}
					throw new HttpException('账户已被禁用', HttpStatus.FORBIDDEN)
				} else {
					await this.storeService.setStore(String(newUser.uid), newUser) //写入缓存
					request.user = newUser
				}
			}

			//验证是否需要角色权限
			if (role) {
				const user: User = request.user

				if (user.username === 'admin') {
					return true //用户名为admin是超级管理员、直接开放全部接口权限
				}

				if (!user.role) {
					throw new HttpException(`账户角色异常`, HttpStatus.FORBIDDEN)
				}

				if (user.role?.status !== 1) {
					throw new HttpException(`账户role角色已被禁用`, HttpStatus.FORBIDDEN)
				}

				const auth = (user.auth || []).find(k => k.auth_key === role.key)
				if (!auth) {
					throw new HttpException(`账户权限不足: 缺少${role.key}权限`, HttpStatus.FORBIDDEN)
				} else if (auth.status !== 1) {
					throw new HttpException(`账户${role.key}权限已被禁用`, HttpStatus.FORBIDDEN)
				} else {
					const apply = auth.apply.find(k => k.key === role.apply)
					if (!apply) {
						throw new HttpException(
							`账户权限不足: 缺少${role.key}=>${role.apply}权限`,
							HttpStatus.FORBIDDEN
						)
					}
				}
			}
		}

		return true
	}
}

//登录守卫  使用AuthUser守卫的接口会验证登录
export const AuthUser = (auth: boolean) => SetMetadata('auth', auth)

//权限守卫  使用Apply守卫的接口会验证角色是否有权限
export const AuthRole = (role: Role) => SetMetadata('role', role)
