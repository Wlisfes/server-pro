import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'
import { Auth } from '@libs/db/models/auth'

@Injectable()
export class AuthService {
	constructor(@InjectModel(Auth) private readonly authModel: ReturnModelType<typeof Auth>) {}

	//获取所有权限列表
	async findAuthAll(): Promise<Auth[]> {
		// await this.authModel.deleteMany({ auth_name: '用户管理' })
		return await this.authModel.find().exec()
	}

	//新增权限模块
	async createAuth() {
		return await new this.authModel({
			auth_name: '用户管理',
			auth_key: 'user',
			apply: [
				{ apply_name: '新增', apply_key: 'create', status: 1 },
				{ apply_name: '删除', apply_key: 'delete', status: 0 },
				{ apply_name: '修改', apply_key: 'update', status: 0 },
				{ apply_name: '查询', apply_key: 'query', status: 1 },
				{ apply_name: '详情', apply_key: 'get', status: 1 },
				{ apply_name: '导入', apply_key: 'import', status: 0 },
				{ apply_name: '导出', apply_key: 'export', status: 0 }
			]
		}).save()
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
	async updateAuth(params) {
		try {
			const apply = params.apply.every(
				k =>
					typeof k.apply_key === 'string' &&
					typeof k.apply_name === 'string' &&
					(k.status === 1 || k.status === 0)
			)
			if (!apply) {
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
