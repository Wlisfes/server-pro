import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DbModule } from 'libs/db/src'
import { UserModule } from './module/user/user.module'
import { MulterModule } from '@nestjs/platform-express'
import { AuthModule } from './module/auth/auth.module'
import { APP_GUARD } from '@nestjs/core'
import { RedisModule } from 'nestjs-redis'
import { AuthGuard } from './guard/auth.guard'
import { RoleModule } from './module/role/role.module'
import { PermissionModule } from './module/permission/permission.module'
import { StoreService } from './service/store/store.service'

import * as MAO from 'multer-aliyun-oss'

@Module({
	imports: [
		RedisModule.register({
			name: 'server_pro',
			host: '120.25.123.165',
			port: 6379,
			db: 1,
			password: '3633',
			keyPrefix: 'pro__',
			onClientReady: async client => {
				client.on('error', err => {
					console.log(err)
				})
			}
		}),
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

		DbModule,
		UserModule,
		AuthModule,
		RoleModule,
		PermissionModule
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: AuthGuard
		},
		StoreService
	]
})
export class AppModule {}
