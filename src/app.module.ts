import { Module } from '@nestjs/common'
import { AppController } from '@/app.controller'
import { AppService } from '@/app.service'

//各端主模块入口导入
import { AdminModule } from '@/module/admin/admin/admin.module'
import { WebModule } from '@/module/web/web/web.module'

@Module({
	imports: [AdminModule, WebModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
