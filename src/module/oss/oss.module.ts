import { Module, Global, DynamicModule } from '@nestjs/common'
import { OSS_OPTIONS, OSSOptions, ossProvider } from './oss.provider'
import { OssController } from './oss.controller'
import { OssService } from './oss.service'

@Global()
@Module({
	imports: [],
	controllers: [OssController],
	providers: [OssService],
	exports: [OssService]
})
export class OssModule {
	public static forRoot(options: OSSOptions): DynamicModule {
		return {
			module: OssModule,
			providers: [ossProvider(), { provide: OSS_OPTIONS, useValue: options }],
			exports: [OssModule]
		}
	}
}
