import { Injectable } from '@nestjs/common'

@Injectable()
export class CommonService {
	//过滤空的参数 null undefined
	filter(params) {
		if (Array.isArray(params)) {
			for (const k of params) {
			}
		}
		for (const key in params) {
			if (params[key] === '' || params[key] === undefined) {
				delete params[key]
			}
		}
		return params
	}
}
