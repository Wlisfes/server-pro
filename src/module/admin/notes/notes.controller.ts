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
	@AuthRole({ key: 'note', apply: 'create' })
	public async createNotes(
		@Body() body: NotesDto.CreateNotesDto,
		@Req() req: { ipv4: string; user: { uid: number } }
	) {
		return await this.notesService.createNotes(body, req.user.uid, req.ipv4)
	}

	@ApiOperation({ summary: '获取所有笔记列表' })
	@Get('all')
	@AuthUser(true)
	@AuthRole({ key: 'note', apply: 'query' })
	public async findNotesAll(@Query() query: NotesDto.FindNotesDto) {
		const limit = query.limit || 5
		const offset = query.offset ? query.offset : 0
		return this.notesService.findNotesAll(query, limit, offset)
	}

	@ApiOperation({ summary: '获取笔记详情' })
	@Get('info')
	@AuthUser(true)
	@AuthRole({ key: 'note', apply: 'get' })
	public async findIdNotes(@Query() query: NotesDto.NotesIdDto) {
		return await this.notesService.findIdNotes(query.id)
	}

	@ApiOperation({ summary: '修改笔记' })
	@Put('update')
	@AuthUser(true)
	@AuthRole({ key: 'note', apply: 'update' })
	async updateNotes(@Body() body: NotesDto.UpdateNotesDto, @Req() req: { ipv4: string; user: { uid: number } }) {
		return await this.notesService.updateNotes(body, req.user.uid, req.ipv4)
	}

	@ApiOperation({ summary: '置顶笔记权重' })
	@Put('sort')
	@AuthUser(true)
	@AuthRole({ key: 'note', apply: 'update' })
	public async updateNotesSort(
		@Query() query: NotesDto.NotesIdDto,
		@Req() req: { ipv4: string; user: { uid: number } }
	) {
		return await this.notesService.updateNotesSort(query, req.user.uid, req.ipv4)
	}

	@ApiOperation({ summary: '切换笔记状态' })
	@Put('cutover')
	@AuthUser(true)
	@AuthRole({ key: 'note', apply: 'update' })
	public async cutoverNotes(
		@Query() query: NotesDto.NotesIdDto,
		@Req() req: { ipv4: string; user: { uid: number } }
	) {
		return await this.notesService.cutoverNotes(query, req.user.uid, req.ipv4)
	}

	@ApiOperation({ summary: '删除笔记' })
	@Delete('delete')
	@AuthUser(true)
	@AuthRole({ key: 'note', apply: 'delete' })
	public async deleteNotes(@Query() query: NotesDto.NotesIdDto, @Req() req: { ipv4: string; user: { uid: number } }) {
		return await this.notesService.deleteNotes(query, req.user.uid, req.ipv4)
	}
}
