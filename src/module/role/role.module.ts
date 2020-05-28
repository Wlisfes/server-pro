import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoleController } from './role.controller'
import { RoleService } from './role.service'
import { UserEntity } from '@/entity/user.entity'
import { RoleEntity } from '@/entity/role.entity'

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity])],
	controllers: [RoleController],
	providers: [RoleService]
})
export class RoleModule {}
