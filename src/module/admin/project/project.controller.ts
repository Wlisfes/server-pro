import { Controller, Post, Get, Put, Delete, Body, Query, Req } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { ProjectService } from '@/module/admin/project/project.service'
import { AuthUser, AuthRole } from '@/guard/auth.guard'
import * as ProjectDto from '@/module/admin/project/project.dto'

const path = `${process.env.ADMINPREFIX}/project`

@Controller(path)
@ApiTags('项目模块')
export class ProjectController {
	constructor(private readonly projectService: ProjectService) {}

	@ApiOperation({ summary: '创建项目' })
	@Post('create')
	@AuthUser(true)
	async createProject(@Body() body: ProjectDto.CreateProjectDto, @Req() req: { user: { uid: number } }) {
		return await this.projectService.createProject(body, req.user.uid)
	}

	@ApiOperation({ summary: '获取所有项目列表' })
	@Get('all')
	@AuthUser(true)
	async findProjectAll(@Query() query: ProjectDto.FindProjectDto) {
		return await this.projectService.findProjectAll(query)
	}

	@ApiOperation({ summary: '获取项目详情' })
	@Get('info')
	@AuthUser(true)
	async findIdProject(@Query() query: ProjectDto.ProjectIdDto) {
		return await this.projectService.findIdProject(query.id)
	}

	@ApiOperation({ summary: '修改项目' })
	@Put('update')
	@AuthUser(true)
	async updateProject(@Body() body: ProjectDto.UpdateProjectDto, @Req() req: { user: { uid: number } }) {
		return await this.projectService.updateProject(body, req.user.uid)
	}

	@ApiOperation({ summary: '置顶项目权重' })
	@Put('sort')
	async updateProjectSort(@Query() query: ProjectDto.ProjectIdDto) {
		return await this.projectService.updateProjectSort(query)
	}

	@ApiOperation({ summary: '切换项目状态' })
	@Put('cutover')
	async cutoverProject(@Query() query: ProjectDto.ProjectIdDto) {
		return await this.projectService.cutoverProject(query)
	}

	@ApiOperation({ summary: '删除项目' })
	@Delete('delete')
	async deleteProject(@Query() query: ProjectDto.ProjectIdDto) {
		return await this.projectService.deleteProject(query)
	}
}
