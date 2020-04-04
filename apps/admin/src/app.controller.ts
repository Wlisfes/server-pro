import { Controller, UseInterceptors, UploadedFile, Get, Post } from '@nestjs/common'
import { AppService } from './app.service'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello(): string {
		return this.appService.getHello()
	}

	@Post('api/upload')
	@UseInterceptors(FileInterceptor('file'))
	async upload(@UploadedFile('file') file) {
		return file
	}
}
