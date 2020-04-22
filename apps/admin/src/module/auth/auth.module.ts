import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { TypegooseModule } from 'nestjs-typegoose'
import { Auth } from '@libs/db/models/auth'

@Module({
	imports: [TypegooseModule.forFeature([Auth])],
	providers: [AuthService],
	controllers: [AuthController]
})
export class AuthModule {}
