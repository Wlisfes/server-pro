import { Module, Global } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OssModule } from '@/common/oss/oss.module'
import { SignModule } from '@/common/sign/sign.module'

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRoot(),
		OssModule.forRoot({
			client: {
				endpoint: process.env.ENDPOINT, // endpoint域名
				accessKeyId: process.env.ACCESSKEYID, // 账号
				accessKeySecret: process.env.ACCESSKEYSECRET, // 密码
				bucket: process.env.BUCKET, // 存储桶
				internal: false,
				secure: false,
				cname: false,
				timeout: process.env.TIMEOUT
			},
			domain: process.env.DOMAIN // 自定义域名
		}),
		SignModule
	],
	exports: [SignModule, OssModule]
})
export class AsyncModule {}
