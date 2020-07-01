import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppService } from '@/module/admin/app/app.service'
import { AppController } from '@/module/admin/app/app.controller'

//守卫
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from '@/guard/auth.guard'

//模块
import { UserModule } from '@/module/admin/user/user.module'
import { RoleModule } from '@/module/admin/role/role.module'
import { AuthModule } from '@/module/admin/auth/auth.module'
import { StoreModule } from '@/common/store/store.module'
import { TagModule } from '@/module/admin/tag/tag.module'
import { ArticleModule } from '@/module/admin/article/article.module'
import { ProjectModule } from '@/module/admin/project/project.module'
import { NotesModule } from '@/module/admin/notes/notes.module'
import { LoggerModule } from '@/module/admin/logger/logger.module'

//数据初始化模块
import { InitModule } from '@/module/admin/init/init.module'

//表组合查询
import { TagEntity } from '@/entity/tag.entity'
import { ArticleEntity } from '@/entity/article.entity'
import { ProjectEntity } from '@/entity/project.entity'
import { NotesEntity } from '@/entity/notes.entity'
import { UserEntity } from '@/entity/user.entity'

@Module({
	imports: [
		UserModule,
		LoggerModule,
		RoleModule,
		AuthModule,
		StoreModule,
		TagModule,
		ArticleModule,
		ProjectModule,
		NotesModule,
		InitModule,
		TypeOrmModule.forFeature([UserEntity, TagEntity, ArticleEntity, ProjectEntity, NotesEntity])
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AuthGuard
		},
		AppService
	],
	exports: [
		UserModule,
		LoggerModule,
		RoleModule,
		AuthModule,
		StoreModule,
		TagModule,
		ArticleModule,
		ProjectModule,
		NotesModule
	],
	controllers: [AppController]
})
export class AppAdminModule {}
