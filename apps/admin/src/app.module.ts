import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MulterModule } from '@nestjs/platform-express'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from './guard/auth.guard'

import * as MAO from 'multer-aliyun-oss'

import { UserModule } from './module/user/user.module'
import { StoreModule } from './module/store/store.module'
import { SignModule } from './module/sign/sign.module'
import { AuthModule } from './module/auth/auth.module'
import { CommonModule } from '@libs/common'

@Module({
	imports: [
		CommonModule, //公共模块
		UserModule, //用户模块
		StoreModule, //缓存模块
		SignModule, //jwt加密模块
		AuthModule, //权限模块
		MulterModule.registerAsync({
			useFactory() {
				return {
					storage: MAO({
						config: {
							region: process.env.OSS_REGION,
							accessKeyId: process.env.OSS_ACCESS_KEY_ID,
							accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
							bucket: process.env.OSS_BUCKET
						}
					})
				}
			}
		})
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
