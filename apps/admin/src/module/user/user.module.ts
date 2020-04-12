import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { AuthModule } from '../auth/auth.module'
import { User } from '@libs/db/models/user.model'
import { ToolService } from '../../service/tool/tool.service'
import { StoreService } from '../../service/store/store.service'

@Module({
	imports: [TypegooseModule.forFeature([User]), AuthModule],
	controllers: [UserController],
	providers: [UserService, ToolService, StoreService],
	exports: [UserService]
})
export class UserModule {}
