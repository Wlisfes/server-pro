import { Module } from '@nestjs/common'
import { AppController } from '@/app.controller'
import { AppService } from '@/app.service'

//各端主模块入口导入
import { AppAdminModule } from '@/module/admin/app/app.module'
import { AppWebModule } from '@/module/web/app/app.module'

@Module({
	imports: [AppAdminModule, AppWebModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
