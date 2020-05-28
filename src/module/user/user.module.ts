import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { UserEntity } from '@/entity/user.entity'
import { ArticleEntity } from '@/entity/article.entity'
import { RoleEntity } from '@/entity/role.entity'

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, ArticleEntity, RoleEntity])],
	controllers: [UserController],
	providers: [UserService]
})
export class UserModule {}
