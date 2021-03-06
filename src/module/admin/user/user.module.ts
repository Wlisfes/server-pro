import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserController } from '@/module/admin/user/user.controller'
import { UserService } from '@/module/admin/user/user.service'
import { UtilsService } from '@/common/utils/utils.service'

import { SignModule } from '@/common/sign/sign.module'
import { StoreModule } from '@/common/store/store.module'
import { LoggerModule } from '@/module/admin/logger/logger.module'

import { UserEntity } from '@/entity/user.entity'
import { ArticleEntity } from '@/entity/article.entity'
import { RoleEntity } from '@/entity/role.entity'
import { AuthEntity } from '@/entity/auth.entity'
import { TagEntity } from '@/entity/tag.entity'

@Module({
	imports: [
		SignModule,
		StoreModule,
		LoggerModule,
		TypeOrmModule.forFeature([UserEntity, ArticleEntity, RoleEntity, AuthEntity, TagEntity])
	],
	controllers: [UserController],
	providers: [UserService, UtilsService],
	exports: [UserService]
})
export class UserModule {}
