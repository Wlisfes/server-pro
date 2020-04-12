import { Module, forwardRef } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './constants'
import { UserModule } from '../user/user.module'
import { StoreService } from '../../service/store/store.service'

@Module({
	imports: [
		forwardRef(() => UserModule),
		JwtModule.register({
			secret: jwtConstants.secret,
			signOptions: { expiresIn: jwtConstants.expiresIn }
		})
	],
	providers: [AuthService, StoreService],
	exports: [AuthService]
})
export class AuthModule {}
