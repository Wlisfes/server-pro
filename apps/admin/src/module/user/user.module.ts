import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { AuthModule } from '../auth/auth.module'
import { User } from '@libs/db/models/user.model'

@Module({
	imports: [AuthModule, TypegooseModule.forFeature([User])],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService]
})
export class UserModule {}
