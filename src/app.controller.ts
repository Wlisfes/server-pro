import { Controller, Get, Post, UseInterceptors, UploadedFile } from '@nestjs/common'
import { AppService } from './app.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiOperation } from '@nestjs/swagger'

@Controller()
@ApiTags('根模块')
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello(): string {
		return this.appService.getHello()
	}

	@Post('api/upload')
	@ApiOperation({ summary: '图片上传' })
	@UseInterceptors(FileInterceptor('file'))
	async upload(@UploadedFile('file') file) {
		return file
	}
}
