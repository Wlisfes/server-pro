import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DbModule } from 'libs/db/src'
import { UserModule } from './module/user/user.module'
import { MulterModule } from '@nestjs/platform-express'
import { AuthModule } from './module/auth/auth.module'
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
		DbModule,
		UserModule,
		AuthModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
