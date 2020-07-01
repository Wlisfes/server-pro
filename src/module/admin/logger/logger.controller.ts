import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { LoggerService } from '@/module/admin/logger/logger.service'

const path = `${process.env.ADMINPREFIX}/logger`

@Controller(path)
@ApiTags('日志模块')
export class LoggerController {
	constructor(private readonly loggerService: LoggerService) {}

	@ApiOperation({ summary: '动态日志列表' })
	@Get('all')
	public async LoggerAll() {
		return await this.loggerService.LoggerAll()
	}
}
