import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '@/entity/user.entity'
import { ArticleEntity } from '@/entity/article.entity'
import { RoleEntity } from '@/entity/role.entity'
import { CreateUserDto, UpdateUserRoleDto } from './user.dto'
import { User } from './user.interface'
import { AuthEntity } from '@/entity/auth.entity'

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
		@InjectRepository(ArticleEntity) private readonly articleModel: Repository<ArticleEntity>,
		@InjectRepository(RoleEntity) private readonly roleModel: Repository<RoleEntity>,
		@InjectRepository(AuthEntity) private readonly authModel: Repository<AuthEntity>
	) {}

	//验证用户信息是否已存在
	public async isUser(params: CreateUserDto) {
		if (await this.userModel.findOne({ where: { username: params.username } })) {
			throw new HttpException(`username: ${params.username} 已存在`, HttpStatus.BAD_REQUEST)
		}

		if (await this.userModel.findOne({ where: { nickname: params.nickname } })) {
			throw new HttpException(`nickname: ${params.nickname} 已存在`, HttpStatus.BAD_REQUEST)
		}

		if (params.email && (await this.userModel.findOne({ where: { email: params.email } }))) {
			throw new HttpException(`email: ${params.email} 已存在`, HttpStatus.BAD_REQUEST)
		}

		if (params.mobile) {
			if (!/^(?:(?:\+|00)86)?1\d{10}$/.test(params.mobile)) {
				throw new HttpException(`mobile: ${params.mobile} 错误`, HttpStatus.BAD_REQUEST)
			}
			if (await this.userModel.findOne({ where: { mobile: params.mobile } })) {
				throw new HttpException(`mobile: ${params.mobile} 已存在`, HttpStatus.BAD_REQUEST)
			}
		}
	}

	//创建用户
	public async createUser(params: CreateUserDto) {
		try {
			await this.isUser(params)
			const user = await this.userModel.create({
				username: params.username,
				password: params.password,
				nickname: params.nickname,
				email: params.email || null,
				mobile: params.mobile || null,
				avatar: params.avatar || null
			})
			return await this.userModel.save(user)
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//获取所有用户列表
	public async findUserAll() {
		return await this.userModel.find({ relations: ['article', 'role', 'auth'] })
	}

	//修改用户权限
	public async updateUserRole(params: UpdateUserRoleDto) {
		try {
			const user = await this.userModel.findOne({ where: { uid: params.uid } })
			if (!user) {
				throw new HttpException('uid 错误', HttpStatus.BAD_REQUEST)
			}

			//修改role表数据
			const role = await this.roleModel.findOne({ where: { id: 1 } })
			if (role) {
				await this.roleModel.update(role, { ...params.role })
			} else {
				const roles = await this.roleModel.create(params.role)
				await this.roleModel.save({ ...roles, user })
			}

			//修改auth表数据
			await new Promise(resolve => {
				params.auth.forEach(async item => {
					const props = {
						auth_key: item.auth_key,
						auth_name: item.auth_name,
						apply: JSON.stringify(item.apply)
					}
					const auth = await this.authModel.findOne({ where: { user, auth_key: item.auth_key } })
					if (auth) {
						await this.authModel.update({ id: auth.id }, props)
					} else {
						const newAuth = await this.authModel.create(props)
						await this.authModel.save({ ...newAuth, user })
					}
				})
				resolve()
			})

			return await this.userModel.findOne({ where: { uid: params.uid }, relations: ['article', 'role', 'auth'] })
		} catch (error) {
			throw new HttpException(error.message || 'uid 错误', HttpStatus.BAD_REQUEST)
		}
	}

	public async updateUserArticle() {
		const user = await this.userModel.findOne({ where: { id: 1 } })
		const article = await this.articleModel.create([{ name: 'Angular' }, { name: 'Vue' }, { name: 'React' }])
		const newArticle = await this.articleModel.save(article.map(k => ({ ...k, user })))

		return newArticle
	}
}
