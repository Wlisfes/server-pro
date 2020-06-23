import { Controller, Get, Post, Put, Delete, Body, Query, Req } from '@nestjs/common'
import { NotesService } from '@/module/admin/notes/notes.service'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { AuthUser, AuthRole } from '@/guard/auth.guard'
import * as NotesDto from '@/module/admin/notes/notes.dto'

const path = `${process.env.ADMINPREFIX}/notes`

@Controller(path)
@ApiTags('笔记模块')
export class NotesController {
	constructor(private readonly notesService: NotesService) {}

	@ApiOperation({ summary: '创建笔记' })
	@Post('create')
	@AuthUser(true)
	public async createNotes(@Body() body: NotesDto.CreateNotesDto, @Req() req: { user: { uid: number } }) {
		return await this.notesService.createNotes(body, req.user.uid)
	}

	@ApiOperation({ summary: '获取所有笔记列表' })
	@Get('all')
	@AuthUser(true)
	public async findNotesAll(@Query() query: NotesDto.FindNotesDto) {
		return this.notesService.findNotesAll(query)
	}

	@ApiOperation({ summary: '获取笔记详情' })
	@Get('info')
	@AuthUser(true)
	public async findIdNotes(@Query() query: NotesDto.NotesIdDto) {
		return await this.notesService.findIdNotes(query.id)
	}

	@ApiOperation({ summary: '修改笔记' })
	@Put('update')
	@AuthUser(true)
	async updateNotes(@Body() body: NotesDto.UpdateNotesDto, @Req() req: { user: { uid: number } }) {
		return await this.notesService.updateNotes(body, req.user.uid)
	}

	@ApiOperation({ summary: '置顶笔记权重' })
	@Put('sort')
	public async updateNotesSort(@Query() query: NotesDto.NotesIdDto) {
		return await this.notesService.updateNotesSort(query)
	}

	@ApiOperation({ summary: '切换笔记状态' })
	@Put('cutover')
	public async cutoverNotes(@Query() query: NotesDto.NotesIdDto) {
		return await this.notesService.cutoverNotes(query)
	}

	@ApiOperation({ summary: '删除笔记' })
	@Delete('delete')
	public async deleteNotes(@Query() query: NotesDto.NotesIdDto) {
		return await this.notesService.deleteNotes(query)
	}
}
