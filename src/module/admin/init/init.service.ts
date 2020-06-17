import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '@/entity/user.entity'
import { RoleEntity } from '@/entity/role.entity'
import { AuthEntity } from '@/entity/auth.entity'

@Injectable()
export class InitService {
	constructor(
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
		@InjectRepository(RoleEntity) private readonly roleModel: Repository<RoleEntity>,
		@InjectRepository(AuthEntity) private readonly authModel: Repository<AuthEntity>
	) {
		this.initUser()
	}

	//初始化用户
	public async initUser() {
		const params = { username: 'admin', password: 'admin', nickname: '情雨随风' }
		const user = await this.userModel.findOne({ where: { username: params.username } })

		//不存在超级管理员
		if (!user) {
			try {
				const newUser = await this.userModel.create(params)
				const saveUser = await this.userModel.save(newUser)

				//初始化角色、权限
				await this.initRole()
				await this.initAuth()

				//创建超级管理员
				const role = await this.roleModel.create({ role_key: 'admin', role_name: '超级管理员', status: 1 })
				await this.roleModel.save({
					...role,
					user: saveUser
				})

				//查找权限
				const auth = await this.authModel.find({ where: { user: null } })

				auth.forEach(async props => {
					const newAuth = await this.authModel.create({
						auth_key: props.auth_key,
						auth_name: props.auth_name,
						status: 1,
						apply: props.apply,
						all: props.apply.length
					})
					await this.authModel.save({ ...newAuth, user: saveUser })
				})

				console.log('数据库初始化完成')
			} catch (error) {
				console.error('数据库初始化错误', error)
			}
		}
	}

	//初始化角色
	public async initRole() {
		const roles = [
			{ role_key: 'paker', role_name: '管理员', status: 1 },
			{ role_key: 'visitor', role_name: '游客', status: 1 }
		]

		roles.forEach(async params => {
			const role = await this.roleModel.findOne({ where: { role_key: params.role_key, user: null } })
			if (!role) {
				const newRole = await this.roleModel.create(params)
				await this.roleModel.save(newRole)
			}
		})
		return true
	}

	//初始化权限
	public async initAuth() {
		const apply = [
			{ name: '新增', key: 'create', status: 1 },
			{ name: '删除', key: 'delete', status: 1 },
			{ name: '修改', key: 'update', status: 1 },
			{ name: '查询', key: 'query', status: 1 },
			{ name: '详情', key: 'get', status: 1 },
			{ name: '导入', key: 'import', status: 1 },
			{ name: '导出', key: 'export', status: 1 }
		]
		const auths = [
			{ auth_key: 'user', auth_name: '用户管理', status: 1, apply, all: apply.length },
			{ auth_key: 'role', auth_name: '角色管理', status: 1, apply, all: apply.length },
			{ auth_key: 'auth', auth_name: '权限管理', status: 1, apply, all: apply.length },
			{ auth_key: 'tag', auth_name: '标签管理', status: 1, apply, all: apply.length },
			{ auth_key: 'project', auth_name: '项目管理', status: 1, apply, all: apply.length },
			{ auth_key: 'article', auth_name: '文章管理', status: 1, apply, all: apply.length },
			{ auth_key: 'note', auth_name: '笔记管理', status: 1, apply, all: apply.length }
		]

		auths.forEach(async params => {
			const auth = await this.authModel.findOne({ where: { auth_key: params.auth_key, user: null } })
			if (!auth) {
				const newAuth = await this.authModel.create({
					auth_key: params.auth_key,
					auth_name: params.auth_name,
					status: params.status || 1,
					apply: params.apply as any,
					all: params.apply.length
				})
				await this.authModel.save(newAuth)
			}
		})

		return true
	}
}
