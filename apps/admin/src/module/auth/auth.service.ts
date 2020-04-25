import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'
import { Auth } from '@libs/db/models/auth'
import { updateAuthDto } from './auth.dto'

@Injectable()
export class AuthService {
	constructor(@InjectModel(Auth) private readonly authModel: ReturnModelType<typeof Auth>) {}

	//验证apply数据
	private everyApply(apply: Array<{ status: number; apply_key: string; apply_name: string }>) {
		return apply.every(
			k =>
				typeof k.apply_key === 'string' &&
				typeof k.apply_name === 'string' &&
				(k.status === 1 || k.status === 0)
		)
	}

	//获取所有权限列表
	async findAuthAll(params?: any): Promise<Auth[]> {
		return await this.authModel
			.find(params)
			.sort({ create_time: -1 })
			.exec()
	}

	//新增权限模块
	async createAuth(params: Auth) {
		try {
			if (await this.authModel.findOne({ auth_key: params.auth_key })) {
				throw new HttpException(`${params.auth_key} 已存在`, HttpStatus.BAD_REQUEST)
			}

			if (!this.everyApply(params.apply)) {
				throw new HttpException('apply 格式错误', HttpStatus.BAD_REQUEST)
			}

			return await new this.authModel(params).save()
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//删除权限模块
	async deleteAuth(id: string) {
		try {
			const response = await this.authModel.deleteOne({ _id: id })

			if (response.deletedCount === 1) {
				return response
			}
			throw new HttpException('id 错误', HttpStatus.BAD_REQUEST)
		} catch (error) {
			throw new HttpException('id 错误', HttpStatus.BAD_REQUEST)
		}
	}

	//切换权限模块状态
	async changeAuth(params: { id: string; status: number }) {
		try {
			const response = await this.authModel.updateOne({ _id: params.id }, { status: params.status })

			if (response.nModified === 1) {
				return response
			}
			throw new HttpException('id 错误', HttpStatus.BAD_REQUEST)
		} catch (error) {
			throw new HttpException('id 错误', HttpStatus.BAD_REQUEST)
		}
	}

	//修改权限模块
	async updateAuth(params: updateAuthDto) {
		try {
			if (!this.everyApply(params.apply)) {
				throw new HttpException('apply 格式错误', HttpStatus.BAD_REQUEST)
			}

			const response = await this.authModel.updateOne({ _id: params.id }, params)

			if (response.nModified === 1) {
				return await this.authModel.findById(params.id)
			}
			throw new HttpException('id 错误', HttpStatus.BAD_REQUEST)
		} catch (error) {
			throw new HttpException(error.message || 'id 错误', HttpStatus.BAD_REQUEST)
		}
	}
}
