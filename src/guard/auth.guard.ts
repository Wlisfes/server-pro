import { Injectable, CanActivate, SetMetadata, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { SignService } from '@/module/sign/sign.service'
import { UserService } from '@/module/user/user.service'

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly signService: SignService,
		private readonly userService: UserService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()
		const auth = this.reflector.get<boolean>('auth', context.getHandler())

		if (auth) {
			//auth条件成立、此处需要验证是否登录
			const token = request.headers['access_token']

			if (!token) {
				throw new HttpException('未登陆', HttpStatus.UNAUTHORIZED)
			}

			//解密token
			const ifyUser = await this.signService.verify(token)
		}

		return true
	}
}

//登录守卫   使用Auth守卫的接口会验证登录
export const AuthUser = (auth: boolean) => SetMetadata('auth', auth)
