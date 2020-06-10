import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AuthEntity } from '@/entity/auth.entity'
import * as AuthDto from '@/module/admin/auth/auth.dto'
import * as day from 'dayjs'

@Injectable()
export class AuthService {
	constructor(@InjectRepository(AuthEntity) private readonly authModel: Repository<AuthEntity>) {}

	//创建权限模块
	async createAuth(params: AuthDto.CreateAuthDto) {
		try {
			if (await this.authModel.findOne({ where: { auth_key: params.auth_key, user: null } })) {
				throw new HttpException(`auth_key: ${params.auth_key} 已存在`, HttpStatus.BAD_REQUEST)
			}

			if (await this.authModel.findOne({ where: { auth_name: params.auth_name, user: null } })) {
				throw new HttpException(`auth_name: ${params.auth_name} 已存在`, HttpStatus.BAD_REQUEST)
			}

			// return params
			const auth = await this.authModel.create({
				auth_key: params.auth_key,
				auth_name: params.auth_name,
				status: params.status || 1,
				apply: params.apply as any,
				all: params.apply.length
			})
			const newAuth = await this.authModel.save(auth)
			return await this.authModel.findOne({ where: { id: newAuth.id } })
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//获取权限列表
	async findAuthAll(params: AuthDto.FindAuthDto) {
		const { auth_name, status, createTime } = params
		const QB = await this.authModel.createQueryBuilder('auth').orderBy({ 'auth.createTime': 'DESC' })

		//auth_name筛选
		if (auth_name !== undefined && auth_name !== null) {
			QB.orWhere('auth.auth_name = :auth_name', {
				auth_name: auth_name
			}).andWhere('auth.user is null')

			QB.orWhere('auth.auth_key = :auth_key', {
				auth_key: auth_name
			}).andWhere('auth.user is null')
		}

		// //时间范围筛选
		if (createTime !== undefined && createTime !== null && createTime !== '') {
			QB.andWhere('auth.createTime BETWEEN :start AND :end', {
				start: params.createTime,
				end: day().toDate()
			})
		}

		// //状态筛选
		if (status !== undefined && status !== null) {
			QB.andWhere('auth.status = :status', { status: params.status })
		}

		return await QB.andWhere('auth.user is null').getMany()
	}

	//获取权限模块详情
	async findIdAuth(params: AuthDto.CutoverAuthDto) {
		return await this.authModel.findOne({ where: { id: params.id } })
	}

	//修改权限模块
	async updateAuth(params: AuthDto.UpdateAuthDto) {
		try {
			const name = await this.authModel.findOne({ where: { auth_name: params.auth_name, user: null } })
			if (name && name.id !== params.id) {
				throw new HttpException(`auth_name: ${params.auth_name} 已存在`, HttpStatus.BAD_REQUEST)
			}

			await this.authModel.update(
				{ id: params.id },
				{
					auth_name: params.auth_name,
					status: params.status,
					apply: params.apply as any,
					all: params.apply.length
				}
			)
			return await this.authModel.findOne({ where: { id: params.id } })
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//切换权限状态
	async cutoverAuth(params: AuthDto.CutoverAuthDto) {
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
	async deleteAuth(params: AuthDto.DeleteAuthDto) {
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
