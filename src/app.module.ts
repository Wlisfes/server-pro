import { Module } from '@nestjs/common'
import { AppController } from '@/app.controller'
import { AppService } from '@/app.service'
import { SessionModule } from 'nestjs-session'

//公共模块、各端主模块入口导入
import { AsyncModule } from '@/common/async/async.module'
import { AppAdminModule } from '@/module/admin/app/app.module'
import { AppWebModule } from '@/module/web/app/app.module'

@Module({
	imports: [
		AsyncModule,
		AppAdminModule,
		AppWebModule,
		SessionModule.forRootAsync({
			useFactory() {
				return {
					session: {
						secret: process.env.SESSION_SECRET,
						cookie: {
							httpOnly: true,
							maxAge: 60 * 1000
						}
					}
				}
			}
		})
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
