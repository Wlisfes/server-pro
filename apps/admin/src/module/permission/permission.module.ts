import { Module } from '@nestjs/common'
import { PermissionService } from './permission.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { Apply } from '@libs/db/models/apply.model'
import { Permission } from '@libs/db/models/permission.model'
import { PermissionController } from './permission.controller'
import { School } from '@libs/db/models/school.model'
import { Student } from '@libs/db/models/student.model'
import { Actions } from '@libs/db/models/actions.model'

@Module({
	imports: [TypegooseModule.forFeature([Apply, Permission, Actions, School, Student])],
	providers: [PermissionService],
	controllers: [PermissionController],
	exports: [PermissionService]
})
export class PermissionModule {}
