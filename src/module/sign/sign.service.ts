import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class SignService {
	constructor(private readonly jwtService: JwtService) {}

	//加密
	async sign(user: { uid: number; username: string; password: string }) {
		return this.jwtService.sign({
			username: user.username,
			password: user.password,
			uid: user.uid
		})
	}

	//解密
	async verify(token: string) {
		try {
			return await this.jwtService.verify(token)
		} catch (error) {
			throw new HttpException('token 错误或已过期', HttpStatus.UNAUTHORIZED)
		}
	}
}
