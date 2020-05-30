import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AuthEntity } from '@/entity/auth.entity'
import { CreateAuthDto, UpdateAuthDto, DeleteAuthDto, CutoverAuthDto } from './auth.dto'

@Injectable()
export class AuthService {
	constructor(@InjectRepository(AuthEntity) private readonly authModel: Repository<AuthEntity>) {}

	//创建权限模块
	async createAuth(params: CreateAuthDto) {
		try {
			if (await this.authModel.findOne({ where: { auth_key: params.auth_key, user: null } })) {
				throw new HttpException(`auth_key: ${params.auth_key} 已存在`, HttpStatus.BAD_REQUEST)
			}

			if (await this.authModel.findOne({ where: { auth_name: params.auth_name, user: null } })) {
				throw new HttpException(`auth_name: ${params.auth_name} 已存在`, HttpStatus.BAD_REQUEST)
			}

			const auth = await this.authModel.create({
				auth_key: params.auth_key,
				auth_name: params.auth_name,
				status: params.status || 1,
				apply: JSON.stringify(params.apply)
			})
			const newAuth = await this.authModel.save(auth)
			return await this.authModel.findOne({ where: { id: newAuth.id } })
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//获取权限列表
	async findAuthAll() {
		return await this.authModel.find({ where: { user: null } })
	}

	//修改权限模块
	async updateAuth(params: UpdateAuthDto) {
		try {
			const key = await this.authModel.findOne({ where: { auth_key: params.auth_key, user: null } })
			if (key && key.id !== params.id) {
				throw new HttpException(`auth_key: ${params.auth_key} 已存在`, HttpStatus.BAD_REQUEST)
			}

			const name = await this.authModel.findOne({ where: { auth_name: params.auth_name, user: null } })
			if (name && name.id !== params.id) {
				throw new HttpException(`auth_name: ${params.auth_name} 已存在`, HttpStatus.BAD_REQUEST)
			}

			await this.authModel.update(
				{ id: params.id },
				{
					auth_key: params.auth_key,
					auth_name: params.auth_name,
					status: params.status,
					apply: JSON.stringify(params.apply)
				}
			)
			return await this.authModel.findOne({ where: { id: params.id } })
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//切换权限状态
	async cutoverAuth(params: CutoverAuthDto) {
		try {
			const auth = await this.authModel.findOne({ where: { id: params.id } })
			if (auth) {
				await this.authModel.update({ id: params.id }, { status: auth.status ? 0 : 1 })
				return await this.authModel.findOne({ where: { id: params.id } })
			}
			throw new HttpException(`id: ${params.id} 错误`, HttpStatus.BAD_REQUEST)
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//删除权限模块
	async deleteAuth(params: DeleteAuthDto) {
		try {
			const auth = await this.authModel.delete({ id: params.id })
			if (auth.affected === 0) {
				throw new HttpException(`id: ${params.id} 错误`, HttpStatus.BAD_REQUEST)
			}
			return auth
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
