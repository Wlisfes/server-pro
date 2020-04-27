import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class SignService {
	constructor(private readonly jwtService: JwtService) {}

	//access_token加密
	async sign(user: { id: string; username: string; password: string }) {
		return this.jwtService.sign({
			username: user.username,
			password: user.password,
			id: user.id
		})
	}

	//access_token解密
	async verify(access_token: string) {
		try {
			return await this.jwtService.verify(access_token)
		} catch (error) {
			throw new HttpException('access_token 错误或已过期', HttpStatus.UNAUTHORIZED)
		}
	}
}
