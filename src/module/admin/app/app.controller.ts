import { Controller, Get, Req, Request } from '@nestjs/common'
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

	@ApiOperation({ summary: 'ip获取' })
	@Get('ip')
	public async AppIp(@Req() req: { ipv4: string }) {
		return req.ipv4
	}
}
