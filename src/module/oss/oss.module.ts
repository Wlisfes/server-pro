import { Module, Global, DynamicModule } from '@nestjs/common'
import { OSS_OPTIONS, ossProvider } from './oss.provider'
import { OssController } from './oss.controller'
import { OssService } from './oss.service'

@Global()
@Module({
	imports: [],
	controllers: [OssController],
	providers: [
		OssService,
		ossProvider(),
		{
			provide: OSS_OPTIONS,
			useValue: {
				client: {
					endpoint: 'oss-cn-shenzhen.aliyuncs.com', // endpoint域名
					accessKeyId: 'LTAI4FpJrHziJMFaTxr6Th4J', // 账号
					accessKeySecret: 'CIQ5iYktzWSbjnWZ92KXW7BoBAZI6O', // 密码
					bucket: 'linvc', // 存储桶
					internal: false, // 是否使用阿里云内部网访问
					secure: false, // 使用 HTTPS
					cname: false, // 自定义endpoint
					timeout: '90s'
				},
				domain: 'http://oss.lisfes.cn' // 自定义域名
			}
		}
	],
	exports: [OssService]
})
export class OssModule {}
