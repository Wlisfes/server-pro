import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'
import { Permission } from '@libs/db/models/permission.model'
import { CreateDto } from './permission.dto'
import { Apply } from '@libs/db/models/apply.model'
import { Student } from '@libs/db/models/student.model'
import { School } from '@libs/db/models/school.model'
import { Actions } from '@libs/db/models/actions.model'

@Injectable()
export class PermissionService {
	constructor(
		@InjectModel(Permission) public readonly permissionModel: ReturnModelType<typeof Permission>,
		@InjectModel(Apply) private readonly applyModel: ReturnModelType<typeof Apply>,
		@InjectModel(Actions) private readonly actionsModel: ReturnModelType<typeof Actions>,
		@InjectModel(Student) public readonly studentModel: ReturnModelType<typeof Student>,
		@InjectModel(School) private readonly schoolModel: ReturnModelType<typeof School>
	) {}

	//获取所有操作类型
	async applyFindAll(): Promise<Apply[]> {
		return await this.applyModel.find()
	}

	//创建权限模块
	async create(form: CreateDto): Promise<Permission | any> {
		try {
			if (await this.permissionModel.findOne({ permission_id: form.permission_id })) {
				throw new HttpException('permission_id 已存在', HttpStatus.BAD_REQUEST)
			}

			const response = await new this.permissionModel({
				permission_id: form.permission_id,
				permission_name: form.permission_name,
				description: form.description,
				disable: form.disable
			}).save()

			const permission = form.permission.map(k => {
				return {
					name: k.name,
					action: k.action,
					check: k.check,
					disable: k.disable,
					apply_id: response
				}
			})
			await this.actionsModel.insertMany(permission)
			return await this.permissionModel.findById(response.id).populate('permission')
		} catch (error) {
			console.log(error)
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//获取所有权限模块列表
	async findAll(): Promise<any> {
		return await this.permissionModel.find().populate('permission')
		// return await this.permissionModel.remove({ permission_name: '用户管理' }).populate('permission')
		// const school = await this.schoolModel.findOne({ name: '清华大学' })
		// return await new this.studentModel({
		// 	name: '亚丝娜'
		// 	// school: school
		// }).save()
		// await this.studentModel.updateOne(
		// 	{ _id: '5e8c9ceba08ea727ec944133' },
		// 	{
		// 		name: '亚丝娜',
		// 		school: school
		// 	}
		// )
		// return await this.studentModel.findById('5e8c9ceba08ea727ec944133').populate('school')
	}
}
