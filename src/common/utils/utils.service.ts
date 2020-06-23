import { Injectable } from '@nestjs/common'
import * as utils from '@/common/utils/utils.static'

@Injectable()
export class UtilsService {
	//字段过滤 filed为不需要的字段
	public async filter(key: utils.key, field: string[] = []) {
		const next = () => k => !field.some(t => t === k)
		switch (key) {
			case 'user':
				return utils.user.filter(next())
			case 'tag':
				return utils.tag.filter(next())
			case 'auth':
				return utils.auth.filter(next())
			case 'role':
				return utils.role.filter(next())
			case 'article':
				return utils.article.filter(next())
			case 'project':
				return utils.project.filter(next())
			case 'notes':
				return utils.notes.filter(next())
		}
	}
}
