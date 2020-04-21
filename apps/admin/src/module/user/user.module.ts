import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypegooseModule } from 'nestjs-typegoose'
import { User } from '@libs/db/models/user'

@Module({
	imports: [TypegooseModule.forFeature([User])],
	providers: [UserService],
	controllers: [UserController]
})
export class UserModule {}
