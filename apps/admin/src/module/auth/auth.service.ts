import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'
import { Auth } from '@libs/db/models/auth'

@Injectable()
export class AuthService {
	constructor(@InjectModel(Auth) private readonly authModel: ReturnModelType<typeof Auth>) {}

	//获取所有权限列表
	async findAuthAll(): Promise<Auth[] | any> {
		// await this.authModel.deleteMany({ auth_name: '用户管理' })
		return await this.authModel.find().exec()
	}

	//新增权限模块
	async createAuth() {
		return await new this.authModel({
			auth_name: '用户管理',
			auth_key: 'user',
			apply: [
				{ apply_name: '新增', apply_key: 'create' },
				{ apply_name: '删除', apply_key: 'delete' },
				{ apply_name: '修改', apply_key: 'update' },
				{ apply_name: '查询', apply_key: 'query' },
				{ apply_name: '详情', apply_key: 'get' },
				{ apply_name: '导入', apply_key: 'import' },
				{ apply_name: '导出', apply_key: 'export' }
			]
		}).save()
	}
}
