import { Controller, UseInterceptors, UploadedFile, UploadedFiles, Post } from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { OssService } from './oss.service'

@Controller('oss')
@ApiTags('文件模块')
export class OssController {
	constructor(private readonly ossService: OssService) {}

	@ApiOperation({ summary: '单张图片上传oss 可用户上传头像' })
	@Post('upload/file')
	@UseInterceptors(FileInterceptor('file'))
	public async uploadFile(@UploadedFile() file) {
		return await this.ossService.uploadFile(file, 'avatar')
	}

	@ApiOperation({ summary: '多张图片上传oss 可用户上传照片' })
	@Post('upload/files')
	@UseInterceptors(FilesInterceptor('file'))
	public async uploadFiles(@UploadedFiles() files) {
		return await this.ossService.uploadFiles(files, 'upload')
	}
}