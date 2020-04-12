import { Injectable } from '@nestjs/common'

@Injectable()
export class ToolService {
	//过滤object中的空字符串
	public filter<T extends Object>(params: {}): T {
		const obj: T = Object.create({})
		for (const key in params) {
			if (params[key] !== '') {
				obj[key] = params[key]
			}
		}
		return obj
	}
}
