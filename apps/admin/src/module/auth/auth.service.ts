import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'

interface SignUser {
	id: string
	username: string
}

@Injectable()
export class AuthService {
	constructor(private readonly jwtService: JwtService, private readonly userService: UserService) {}

	//token加密
	async sign(user: SignUser) {
		return this.jwtService.sign(user)
	}

	//token解密
	async verify(token: string) {
		try {
			//token解密
			const { id } = await this.jwtService.verify(token)

			//从用户表读取用户数据
			return await this.userService.userModel.findById(id, { password: 0 })
		} catch (error) {
			throw new HttpException('token 错误或已过期', HttpStatus.UNAUTHORIZED)
		}
	}
}
