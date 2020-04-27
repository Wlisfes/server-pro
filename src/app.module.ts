import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'

/**OSS模块*******************************/
import { MulterModule } from '@nestjs/platform-express'
import * as MAO from 'multer-aliyun-oss'

/**守卫*******************************/
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from './guard/auth.guard'

/**逻辑模块*******************************/
import { CommonModule } from './module/common/common.module'
import { UserModule } from './module/user/user.module'
import { RoleModule } from './module/role/role.module'
import { SignModule } from './module/sign/sign.module'
import { StoreModule } from './module/store/store.module'
import { AuthModule } from './module/auth/auth.module'

@Module({
	imports: [
		CommonModule,
		UserModule,
		RoleModule,
		AuthModule,
		SignModule,
		StoreModule,
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
