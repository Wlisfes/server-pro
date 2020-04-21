import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DbModule } from 'libs/db/src'
import { MulterModule } from '@nestjs/platform-express'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from './guard/auth.guard'

import * as MAO from 'multer-aliyun-oss'

@Module({
	imports: [
		MulterModule.registerAsync({
			useFactory() {
				return {
					storage: MAO({
						config: {
							region: 'oss-cn-shenzhen',
							accessKeyId: 'LTAI4FpJrHziJMFaTxr6Th4J',
							accessKeySecret: 'CIQ5iYktzWSbjnWZ92KXW7BoBAZI6O',
							bucket: 'linvc'
						}
					})
				}
			}
		}),
		DbModule
	],
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
