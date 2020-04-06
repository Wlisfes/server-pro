import { Module } from '@nestjs/common'
import { PermissionService } from './permission.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { Apply } from '@libs/db/models/apply.model'
import { Permission } from '@libs/db/models/permission.model'
import { PermissionController } from './permission.controller'

@Module({
	imports: [TypegooseModule.forFeature([Apply, Permission])],
	providers: [PermissionService],
	controllers: [PermissionController],
	exports: [PermissionService]
})
export class PermissionModule {}
