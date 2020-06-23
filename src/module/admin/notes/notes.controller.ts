import { Controller, Get } from '@nestjs/common'
import { NotesService } from '@/module/admin/notes/notes.service'
import { ApiTags, ApiOperation } from '@nestjs/swagger'

const path = `${process.env.ADMINPREFIX}/notes`

@Controller(path)
@ApiTags('笔记模块')
export class NotesController {
	constructor(private readonly notesService: NotesService) {}

	@ApiOperation({ summary: '获取所有笔记' })
	@Get('all')
	public async findNotesAll() {
		return this.notesService.findNotesAll()
	}
}
