import { Injectable } from '@nestjs/common'
import { RedisService } from 'nestjs-redis'

@Injectable()
export class StoreService {
	constructor(private readonly redisService: RedisService) {}

	get Store() {
		return this.redisService.getClient('server_pro')
	}

	async setStore(key: string, value: any, time = 6) {
		return await this.Store.set(key, JSON.stringify(value), 'EX', time * 3600)
	}

	async getStore(key: string) {
		return JSON.parse(await this.Store.get(key))
	}

	async delStore(key: string) {
		return await this.Store.del(key)
	}
}
