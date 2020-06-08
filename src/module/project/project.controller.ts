import { Controller, Post, Body, Req } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { ProjectService } from '@/module/project/project.service'
import { AuthUser, AuthRole } from '@/guard/auth.guard'
import * as ProjectDto from '@/module/project/project.dto'

@Controller('api/project')
@ApiTags('项目模块')
export class ProjectController {
	constructor(private readonly projectService: ProjectService) {}

	@ApiOperation({ summary: '创建项目' })
	@Post('create')
	@AuthUser(true)
	async createProject(@Body() body: ProjectDto.CreateProjectDto, @Req() req: { user: { uid: number } }) {
		return await this.projectService.createProject(body, req.user.uid)
	}
}
