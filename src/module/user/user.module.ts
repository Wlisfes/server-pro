import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypegooseModule } from 'nestjs-typegoose'
import { StoreService } from '../store/store.service'
import { SignModule } from '../sign/sign.module'
import { User } from '../db/models/user'
import { UserRole } from '../db/models/userRole'
import { Role } from '../db/models/role'

@Module({
	imports: [SignModule, TypegooseModule.forFeature([User, UserRole, Role])],
	providers: [UserService, StoreService],
	controllers: [UserController],
	exports: [UserService]
})
export class UserModule {}
