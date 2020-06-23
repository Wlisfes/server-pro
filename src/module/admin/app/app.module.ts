import { Module } from '@nestjs/common'

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

//数据初始化模块
import { InitModule } from '@/module/admin/init/init.module'

@Module({
	imports: [
		UserModule,
		RoleModule,
		AuthModule,
		StoreModule,
		TagModule,
		ArticleModule,
		ProjectModule,
		NotesModule,
		InitModule
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AuthGuard
		}
	],
	exports: [UserModule, RoleModule, AuthModule, StoreModule, TagModule, ArticleModule, ProjectModule, NotesModule]
})
export class AppAdminModule {}
