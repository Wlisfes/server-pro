import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserController } from '@/module/user/user.controller'
import { UserService } from '@/module/user/user.service'

import { SignModule } from '@/module/sign/sign.module'
import { StoreModule } from '@/module/store/store.module'

import { UserEntity } from '@/entity/user.entity'
import { ArticleEntity } from '@/entity/article.entity'
import { RoleEntity } from '@/entity/role.entity'
import { AuthEntity } from '@/entity/auth.entity'
import { TagEntity } from '@/entity/tag.entity'

@Module({
	imports: [
		SignModule,
		StoreModule,
		TypeOrmModule.forFeature([UserEntity, ArticleEntity, RoleEntity, AuthEntity, TagEntity])
	],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService]
})
export class UserModule {}
