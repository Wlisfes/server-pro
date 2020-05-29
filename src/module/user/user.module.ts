import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { SignModule } from '@/module/sign/sign.module'
import { UserEntity } from '@/entity/user.entity'
import { ArticleEntity } from '@/entity/article.entity'
import { RoleEntity } from '@/entity/role.entity'
import { AuthEntity } from '@/entity/auth.entity'

@Module({
	imports: [SignModule, TypeOrmModule.forFeature([UserEntity, ArticleEntity, RoleEntity, AuthEntity])],
	controllers: [UserController],
	providers: [UserService]
})
export class UserModule {}
