import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { compareSync } from 'bcryptjs'
import { UserEntity } from '@/entity/user.entity'
import { ArticleEntity } from '@/entity/article.entity'
import { RoleEntity } from '@/entity/role.entity'
import { UserUid, CreateUserDto, UpdateUserRoleDto, LoginUserDto, UpdateUserDto, UserAvatarDto } from './user.dto'
import { AuthEntity } from '@/entity/auth.entity'
import { SignService } from '@/module/sign/sign.service'

@Injectable()
export class UserService {
	constructor(
		private readonly signService: SignService,
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
		@InjectRepository(ArticleEntity) private readonly articleModel: Repository<ArticleEntity>,
		@InjectRepository(RoleEntity) private readonly roleModel: Repository<RoleEntity>,
		@InjectRepository(AuthEntity) private readonly authModel: Repository<AuthEntity>
	) {}

	//创建用户
	public async createUser(params: CreateUserDto): Promise<UserEntity> {
		try {
			if (await this.userModel.findOne({ where: { username: params.username } })) {
				throw new HttpException(`username: ${params.username} 已存在`, HttpStatus.BAD_REQUEST)
			}

			if (await this.userModel.findOne({ where: { nickname: params.nickname } })) {
				throw new HttpException(`nickname: ${params.nickname} 已存在`, HttpStatus.BAD_REQUEST)
			}

			const user = await this.userModel.create({
				username: params.username,
				password: params.password,
				nickname: params.nickname
			})
			const saveUser = await this.userModel.save(user)

			delete saveUser.password
			return saveUser
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//修改用户信息
	async updateUser(params: UpdateUserDto) {
		try {
			const user = await this.userModel.findOne({ where: { uid: params.uid } })
			if (!user) {
				throw new HttpException(`uid: ${params.uid} 错误`, HttpStatus.BAD_REQUEST)
			}

			const name = await this.userModel.findOne({ where: { nickname: params.nickname } })
			if (name && name.uid !== params.uid) {
				throw new HttpException(`nickname: ${params.nickname} 已存在`, HttpStatus.BAD_REQUEST)
			}

			if (params.email) {
				const email = await this.userModel.findOne({ where: { email: params.email } })
				if (email && email.uid !== params.uid) {
					throw new HttpException(`email: ${params.email} 已存在`, HttpStatus.BAD_REQUEST)
				}
			} else {
				delete params.email
			}

			if (params.mobile) {
				const mobile = await this.userModel.findOne({ where: { mobile: params.mobile } })
				if (mobile && mobile.uid !== params.uid) {
					throw new HttpException(`mobile: ${params.mobile} 已存在`, HttpStatus.BAD_REQUEST)
				}
			} else {
				delete params.mobile
			}

			await this.userModel.update({ uid: params.uid }, params)
			return await this.userModel.findOne({ where: { uid: params.uid } })
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//修改用户头像
	async updateUserAvatar(params: UserAvatarDto) {
		try {
			const user = await this.userModel.findOne({ where: { uid: params.uid } })
			if (user) {
				await this.userModel.update({ uid: params.uid }, params)
				return await this.userModel.findOne({ where: { uid: params.uid } })
			}
			throw new HttpException(`uid: ${params.uid} 错误`, HttpStatus.BAD_REQUEST)
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//登录
	async loginUser(params: LoginUserDto): Promise<any> {
		const user = await this.userModel
			.createQueryBuilder('user')
			.orWhere('user.username = :username', { username: params.username })
			.orWhere('user.email = :email', { email: params.email })
			.orWhere('user.mobile = :mobile', { mobile: params.mobile })
			.getOne()

		if (user) {
			if (user.status !== 1) {
				throw new HttpException('账户已被禁用', HttpStatus.BAD_REQUEST)
			}

			if (!compareSync(params.password, user.password)) {
				throw new HttpException('password 错误', HttpStatus.BAD_REQUEST)
			}

			const access_token = await this.signService.sign({
				uid: user.uid,
				username: user.username,
				password: user.password
			})

			delete user.password
			return { ...user, access_token }
		}
		throw new HttpException('username、email、mobile 错误', HttpStatus.BAD_REQUEST)
	}

	//根据uid获取用户详情信息
	public async findUidUser(uid: number): Promise<UserEntity | null> {
		return await this.userModel.findOne({
			where: { uid },
			select: ['id', 'uid', 'username', 'nickname', 'email', 'mobile', 'avatar', 'status', 'createTime'],
			relations: ['role', 'auth']
		})
	}

	//获取所有用户列表
	public async findUserAll(): Promise<UserEntity[]> {
		return await this.userModel.find({
			order: { id: 'DESC' },
			select: ['id', 'uid', 'username', 'nickname', 'email', 'mobile', 'avatar', 'status', 'createTime'],
			relations: ['article', 'role', 'auth']
		})
	}

	//切换权限状态
	async cutoverUser(params: UserUid) {
		try {
			const role = await this.userModel.findOne({ where: { uid: params.uid } })
			if (role) {
				await this.userModel.update({ uid: params.uid }, { status: role.status ? 0 : 1 })
				return await this.userModel.findOne({ where: { uid: params.uid } })
			}
			throw new HttpException(`uid: ${params.uid} 错误`, HttpStatus.BAD_REQUEST)
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//修改用户权限
	public async updateUserRole(params: UpdateUserRoleDto): Promise<UserEntity> {
		try {
			const user = await this.userModel.findOne({ where: { uid: params.uid } })
			if (!user) {
				throw new HttpException('uid 错误', HttpStatus.BAD_REQUEST)
			}

			//修改role表数据
			const role = await this.roleModel.findOne({ where: { user, role_key: params.role.role_key } })
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
						status: item.status,
						apply: item.apply as any,
						all: item.apply.length
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

			return await this.findUidUser(params.uid)
		} catch (error) {
			throw new HttpException(error.message || 'uid 错误', HttpStatus.BAD_REQUEST)
		}
	}

	//删除用户
	async deleteUser(params: UserUid) {
		try {
			//查找uid对应的用户
			const user = await this.userModel.findOne({ where: { uid: params.uid } })
			if (user) {
				const role = await this.roleModel.delete({ user }) //删除用户对应角色
				const auth = await this.authModel.delete({ user }) //删除用户对应权限
				const article = await this.articleModel.delete({ user }) //删除用户对应文章
				const delUser = await this.userModel.delete({ uid: params.uid }) //删除用户
				return {
					role,
					auth,
					article,
					user: delUser
				}
			}
			throw new HttpException(`uid: ${params.uid} 错误`, HttpStatus.BAD_REQUEST)
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	// public async updateUserArticle() {
	// 	const user = await this.userModel.findOne({ where: { id: 1 } })
	// 	const article = await this.articleModel.create([{ name: 'Angular' }, { name: 'Vue' }, { name: 'React' }])
	// 	const newArticle = await this.articleModel.save(article.map(k => ({ ...k, user })))

	// 	return newArticle
	// }
}
