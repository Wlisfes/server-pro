import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypegooseModule } from 'nestjs-typegoose'
import { User } from '@libs/db/models/user'
import { Role } from '@libs/db/models/role'
import { StoreService } from '../store/store.service'
import { SignModule } from '../sign/sign.module'
import { UserRole } from '@libs/db/models/userRole'

@Module({
	imports: [SignModule, TypegooseModule.forFeature([User, UserRole, Role])],
	providers: [UserService, StoreService],
	controllers: [UserController],
	exports: [UserService]
})
export class UserModule {}
