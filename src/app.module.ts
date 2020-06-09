import { Module } from '@nestjs/common'
import { AppController } from '@/app.controller'
import { AppService } from '@/app.service'

//守卫
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from '@/guard/auth.guard'

//模块
import { CommonModule } from '@/module/admin/common/common.module'
import { UserModule } from '@/module/admin/user/user.module'
import { RoleModule } from '@/module/admin/role/role.module'
import { AuthModule } from '@/module/admin/auth/auth.module'
import { StoreModule } from '@/module/admin/store/store.module'
import { TagModule } from '@/module/admin/tag/tag.module'
import { ArticleModule } from '@/module/admin/article/article.module'
import { ProjectModule } from '@/module/admin/project/project.module'

@Module({
	imports: [CommonModule, UserModule, RoleModule, AuthModule, StoreModule, TagModule, ArticleModule, ProjectModule],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: AuthGuard
		}
	]
})
export class AppModule {}
