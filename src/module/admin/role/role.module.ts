import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoleController } from './role.controller'
import { RoleService } from './role.service'
import { RoleEntity } from '@/entity/role.entity'

@Module({
	imports: [TypeOrmModule.forFeature([RoleEntity])],
	controllers: [RoleController],
	providers: [RoleService]
})
export class RoleModule {}
