import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { LoggerService } from '@/module/admin/logger/logger.service'
import * as LoggerDto from '@/module/admin/logger/logger.dto'

const path = `${process.env.ADMINPREFIX}/logger`

@Controller(path)
@ApiTags('日志模块')
export class LoggerController {
	constructor(private readonly loggerService: LoggerService) {}

	@ApiOperation({ summary: '动态日志列表' })
	@Get('all')
	public async LoggerAll(@Query() query: LoggerDto.Logger) {
		const limit = query.limit || 5
		const offset = query.offset ? query.offset : 0
		return await this.loggerService.LoggerAll(limit, offset)
	}
}
