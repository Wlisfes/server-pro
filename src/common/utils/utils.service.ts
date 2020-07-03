import { Injectable } from '@nestjs/common'
import * as utils from '@/common/utils/utils.static'

@Injectable()
export class UtilsService {
	public useUtils() {
		return utils
	}

	//字段过滤 filed为不需要的字段
	public async filter(key: utils.key, alias: utils.key, field: string[] = []) {
		const next = () => k => !field.some(t => t === k)
		switch (key) {
			case 'user':
				return utils.user.filter(next()).map(k => `${alias}.${k}`)
			case 'tag':
				return utils.tag.filter(next()).map(k => `${alias}.${k}`)
			case 'auth':
				return utils.auth.filter(next()).map(k => `${alias}.${k}`)
			case 'role':
				return utils.role.filter(next()).map(k => `${alias}.${k}`)
			case 'article':
				return utils.article.filter(next()).map(k => `${alias}.${k}`)
			case 'project':
				return utils.project.filter(next()).map(k => `${alias}.${k}`)
			case 'notes':
				return utils.notes.filter(next()).map(k => `${alias}.${k}`)
			case 'logger':
				return utils.logger.filter(next()).map(k => `${alias}.${k}`)
		}
	}
}
