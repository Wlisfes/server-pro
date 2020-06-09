import { Module } from '@nestjs/common'
import { AppController } from '@/app.controller'
import { AppService } from '@/app.service'

//公共模块、各端主模块入口导入
import { AsyncModule } from '@/common/async/async.module'
import { AppAdminModule } from '@/module/admin/app/app.module'
import { AppWebModule } from '@/module/web/app/app.module'

@Module({
	imports: [AsyncModule, AppAdminModule, AppWebModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
