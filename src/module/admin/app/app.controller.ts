import { Controller, Get } from '@nestjs/common'
import { AppService } from '@/module/admin/app/app.service'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { AuthUser } from '@/guard/auth.guard'

const path = `${process.env.ADMINPREFIX}/app`

@Controller(path)
@ApiTags('统计模块')
export class AppController {
	constructor(private readonly appService: AppService) {}

	@ApiOperation({ summary: '信息统计' })
	@Get('count')
	public async AppCount() {
		return await this.appService.AppCount()
	}
}
