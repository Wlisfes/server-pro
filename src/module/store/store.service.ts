import { Injectable } from '@nestjs/common'
import { put, get, del } from 'memory-cache'

@Injectable()
export class StoreService {
	//写入缓存
	async setStore(key: string, value: any, time: number = 6) {
		return put(key, value, time * 3600 * 1000)
	}

	//读取缓存
	async getStore(key: string) {
		return get(key)
	}

	//删除缓存
	async delStore(key: string) {
		return del(key)
	}
}
