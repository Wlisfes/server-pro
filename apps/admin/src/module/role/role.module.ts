import { Module } from '@nestjs/common'
import { RoleController } from './role.controller'
import { RoleService } from './role.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { Role } from '@libs/db/models/role.model'
import { Permission } from '@libs/db/models/permission.model'
import { Apply } from '@libs/db/models/apply.model'

@Module({
	imports: [TypegooseModule.forFeature([Role, Apply, Permission])],
	controllers: [RoleController],
	providers: [RoleService],
	exports: [RoleService]
})
export class RoleModule {}
