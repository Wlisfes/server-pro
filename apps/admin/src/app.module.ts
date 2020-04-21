import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DbModule } from 'libs/db/src'
import { MulterModule } from '@nestjs/platform-express'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from './guard/auth.guard'

import * as MAO from 'multer-aliyun-oss'

import { UserModule } from './module/user/user.module'
import { StoreModule } from './module/store/store.module'
import { SignModule } from './module/sign/sign.module';

@Module({
	imports: [
		DbModule,
		UserModule,
		StoreModule,
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
		SignModule
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
