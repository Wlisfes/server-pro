import { Module } from '@nestjs/common'
import { SignService } from './sign.service'
import { JwtModule } from '@nestjs/jwt'

@Module({
	imports: [
		JwtModule.registerAsync({
			useFactory() {
				return {
					secret: process.env.JWTSECRET,
					signOptions: { expiresIn: 12 * 60 * 60 }
				}
			}
		})
	],
	providers: [SignService],
	exports: [SignService]
})
export class SignModule {}
