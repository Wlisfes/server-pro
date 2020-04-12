import { Injectable, CanActivate, SetMetadata, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthService } from '../module/auth/auth.service'

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly reflector: Reflector, private readonly authService: AuthService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()
		const roles = this.reflector.get<string[]>('roles', context.getHandler())
		const auth = this.reflector.get<string[]>('auth', context.getHandler())

		if (auth) {
			//验证access_token登录
			if (!request.headers['access_token']) {
				throw new HttpException('缺少 access_token', HttpStatus.UNAUTHORIZED)
			}

			const user = await this.authService.verify(request.headers['access_token'])

			request.user = user
		}

		if (roles) {
			//验证权限
			console.log(roles.includes('admin'))
		}

		return true
	}
}

//登录守卫   使用Auth守卫的接口会验证登录
export const AuthUser = (auth: boolean) => SetMetadata('auth', auth)

//角色守卫   使用了Roles守卫的接口会验证角色
export const AuthRoles = (...roles: string[]) => SetMetadata('roles', roles)
