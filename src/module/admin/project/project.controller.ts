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
	@AuthRole({ key: 'project', apply: 'create' })
	async createProject(
		@Body() body: ProjectDto.CreateProjectDto,
		@Req() req: { ipv4: string; user: { uid: number } }
	) {
		return await this.projectService.createProject(body, req.user.uid, req.ipv4)
	}

	@ApiOperation({ summary: '获取所有项目列表' })
	@Get('all')
	@AuthUser(true)
	@AuthRole({ key: 'project', apply: 'query' })
	async findProjectAll(@Query() query: ProjectDto.FindProjectDto) {
		return await this.projectService.findProjectAll(query)
	}

	@ApiOperation({ summary: '获取项目详情' })
	@Get('info')
	@AuthUser(true)
	@AuthRole({ key: 'project', apply: 'get' })
	async findIdProject(@Query() query: ProjectDto.ProjectIdDto) {
		return await this.projectService.findIdProject(query.id)
	}

	@ApiOperation({ summary: '修改项目' })
	@Put('update')
	@AuthUser(true)
	@AuthRole({ key: 'project', apply: 'update' })
	async updateProject(
		@Body() body: ProjectDto.UpdateProjectDto,
		@Req() req: { ipv4: string; user: { uid: number } }
	) {
		return await this.projectService.updateProject(body, req.user.uid, req.ipv4)
	}

	@ApiOperation({ summary: '置顶项目权重' })
	@Put('sort')
	@AuthUser(true)
	@AuthRole({ key: 'project', apply: 'update' })
	async updateProjectSort(
		@Query() query: ProjectDto.ProjectIdDto,
		@Req() req: { ipv4: string; user: { uid: number } }
	) {
		return await this.projectService.updateProjectSort(query, req.user.uid, req.ipv4)
	}

	@ApiOperation({ summary: '切换项目状态' })
	@Put('cutover')
	@AuthUser(true)
	@AuthRole({ key: 'project', apply: 'update' })
	async cutoverProject(@Query() query: ProjectDto.ProjectIdDto, @Req() req: { ipv4: string; user: { uid: number } }) {
		return await this.projectService.cutoverProject(query, req.user.uid, req.ipv4)
	}

	@ApiOperation({ summary: '删除项目' })
	@Delete('delete')
	@AuthUser(true)
	@AuthRole({ key: 'project', apply: 'delete' })
	async deleteProject(@Query() query: ProjectDto.ProjectIdDto, @Req() req: { ipv4: string; user: { uid: number } }) {
		return await this.projectService.deleteProject(query, req.user.uid, req.ipv4)
	}
}
