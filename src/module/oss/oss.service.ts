import { Injectable, Inject } from '@nestjs/common'
import { OSS_CONST, OSS_OPTIONS, OSSOptions } from './oss.provider'
import { OSSSucessResponse, File, UploadResult } from './oss.interface'
import * as OSS from 'ali-oss'
import * as stream from 'stream'
import * as path from 'path'

export class OSSBase {
	protected ossClient: OSS
	protected options: OSSOptions

	//流式上传
	public async putStream(target: string, imageStream: stream.PassThrough): Promise<OSSSucessResponse> {
		return await this.ossClient.putStream(target, imageStream)
	}

	//创建文件流
	public async createStream(buffer: Buffer | any): Promise<stream.PassThrough> {
		const fileStream = new stream.PassThrough()
		fileStream.end(buffer)
		return fileStream
	}

	//重命名
	public getRename(filename: string) {
		const name = path.extname(filename).toLowerCase()
		return `${new Date().getTime()}${name}`
	}
}

@Injectable()
export class OssService extends OSSBase {
	constructor(
		@Inject(OSS_CONST) protected readonly ossClient: OSS,
		@Inject(OSS_OPTIONS) protected readonly options: OSSOptions
	) {
		super()
	}

	//单文件上传
	async uploadFile(file: File, path: string) {
		const result: UploadResult = { upload: false, name: '', url: '', path: '', message: '上传失败' }
		try {
			const target = `${path}/${this.getRename(file.originalname)}`
			const buffer = await this.createStream(file.buffer)
			const response = await this.putStream(target, buffer)
			if (response.res.status === 200) {
				result.upload = true
				result.name = response.name
				result.url = response.url
				result.path = `${this.options.domain}/${response.name}`
				result.message = '上传成功'
			}
		} catch (error) {
			result.message = error.message || error.toString()
		}
		return result
	}

	//多文件上传
	async uploadFiles(files: File[], path: string) {
		const resultFiles: UploadResult[] = []
		for (const file of files) {
			const result: UploadResult = { upload: false, name: '', url: '', path: '', message: '上传失败' }
			try {
				const target = `${path}/${this.getRename(file.originalname)}`
				const buffer = await this.createStream(file.buffer)
				const response = await this.putStream(target, buffer)
				if (response.res.status === 200) {
					result.upload = true
					result.name = response.name
					result.url = response.url
					result.path = `${this.options.domain}/${response.name}`
					result.message = '上传成功'
				}
			} catch (error) {
				result.message = error.message || error.toString()
			}
			resultFiles.push(result)
		}
		return resultFiles
	}
}
