import { Module } from '@nestjs/common'
import { InitService } from '@/module/admin/init/init.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '@/entity/user.entity'
import { AuthEntity } from '@/entity/auth.entity'
import { RoleEntity } from '@/entity/role.entity'

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, AuthEntity, RoleEntity])],
	providers: [InitService]
})
export class InitModule {}
