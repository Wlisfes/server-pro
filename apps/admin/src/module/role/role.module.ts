import { Module } from '@nestjs/common'
import { RoleService } from './role.service'
import { RoleController } from './role.controller'
import { TypegooseModule } from 'nestjs-typegoose'
import { Role } from '@libs/db/models/role'

@Module({
	imports: [TypegooseModule.forFeature([Role])],
	providers: [RoleService],
	controllers: [RoleController]
})
export class RoleModule {}
