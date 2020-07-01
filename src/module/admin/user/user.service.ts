import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { compareSync } from 'bcryptjs'
import { UserEntity } from '@/entity/user.entity'
import { ArticleEntity } from '@/entity/article.entity'
import { RoleEntity } from '@/entity/role.entity'
import { AuthEntity } from '@/entity/auth.entity'
import { SignService } from '@/common/sign/sign.service'
import { StoreService } from '@/common/store/store.service'
import { UtilsService } from '@/common/utils/utils.service'
import { LoggerService } from '@/module/admin/logger/logger.service'
import * as UserDto from '@/module/admin/user/user.dto'
import * as day from 'dayjs'
import * as svgCaptcha from 'svg-captcha'

@Injectable()
export class UserService {
	constructor(
		private readonly signService: SignService,
		private readonly storeService: StoreService,
		private readonly utilsService: UtilsService,
		private readonly loggerService: LoggerService,
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
		@InjectRepository(ArticleEntity) private readonly articleModel: Repository<ArticleEntity>,
		@InjectRepository(RoleEntity) private readonly roleModel: Repository<RoleEntity>,
		@InjectRepository(AuthEntity) private readonly authModel: Repository<AuthEntity>
	) {}

	//验证码
	public async svgCode(): Promise<any> {
		const Code = svgCaptcha.create({
			fontSize: 36,
			noise: 2,
			width: 123,
			height: 40,
			inverse: true,
			background: '#cc9966'
		})
		return Code
	}

	//创建用户
	public async createUser(params: UserDto.CreateUserDto, code: string): Promise<UserEntity> {
		try {
			if (code !== params.code.toUpperCase()) {
				throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST)
			}

			if (await this.userModel.findOne({ where: { username: params.username } })) {
				throw new HttpException(`username: ${params.username} 已存在`, HttpStatus.BAD_REQUEST)
			}

			if (await this.userModel.findOne({ where: { nickname: params.nickname } })) {
				throw new HttpException(`nickname: ${params.nickname} 已存在`, HttpStatus.BAD_REQUEST)
			}

			//插入用户
			const user = await this.userModel.create({
				username: params.username,
				password: params.password,
				nickname: params.nickname
			})
			const saveUser = await this.userModel.save(user)

			//插入用户角色
			await this.roleModel
				.createQueryBuilder('role')
				.insert()
				.values({
					role_key: 'visitor',
					role_name: '游客',
					status: 1,
					user: saveUser
				})
				.execute()

			//插入权限
			const auth = await this.authModel.find({
				where: { user: null },
				select: ['auth_key', 'auth_name', 'apply', 'all', 'status']
			})
			const newAuth = auth.map(k => {
				const apply = (k.apply as any).filter(k => k.key === 'query' || k.key === 'get')
				return {
					...k,
					apply,
					all: apply.length,
					user: saveUser
				}
			})
			await this.authModel
				.createQueryBuilder('auth')
				.insert()
				.values(newAuth)
				.execute()

			return await this.findUidUser(saveUser.uid)
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//修改用户信息
	async updateUser(params: UserDto.UpdateUserDto) {
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
			await this.storeService.delStore(String(params.uid))
			return await this.userModel.findOne({ where: { uid: params.uid } })
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//修改用户头像
	async updateUserAvatar(params: UserDto.UserAvatarDto) {
		try {
			const user = await this.userModel.findOne({ where: { uid: params.uid } })
			if (user) {
				await this.userModel.update({ uid: params.uid }, params)
				await this.storeService.delStore(String(params.uid))
				return await this.userModel.findOne({ where: { uid: params.uid } })
			}
			throw new HttpException(`uid: ${params.uid} 错误`, HttpStatus.BAD_REQUEST)
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//登录
	async loginUser(params: UserDto.LoginUserDto, code: string): Promise<any> {
		try {
			if (code !== params.code.toUpperCase()) {
				throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST)
			}

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

				//写入登录日志
				await this.loggerService.createLoginLogger(user.uid)

				delete user.password
				return { ...user, access_token }
			}
			throw new HttpException('username、email、mobile 错误', HttpStatus.BAD_REQUEST)
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
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
	public async findUserAll(params: UserDto.FindUserDto): Promise<UserEntity[] | any> {
		const U = await this.utilsService.filter('user', 'user', ['article', 'project', 'notes', 'tag', 'role', 'auth'])
		const R = await this.utilsService.filter('role', 'role', ['user'])
		const A = await this.utilsService.filter('auth', 'auth', ['user'])

		const { nickname, status, createTime } = params

		const QB = this.userModel
			.createQueryBuilder('user')
			.select([].concat(U, R, A))
			.leftJoin('user.role', 'role')
			.leftJoin('user.auth', 'auth')
			.orderBy({ 'user.createTime': 'DESC' })

		//nickname筛选
		if (nickname !== undefined && nickname !== null && nickname !== '') {
			QB.where('user.nickname = :nickname', {
				nickname: nickname
			})
			QB.orWhere('user.username = :username', {
				username: nickname
			})
		}

		// //时间范围筛选
		if (createTime !== undefined && createTime !== null && createTime !== '') {
			QB.andWhere('user.createTime BETWEEN :start AND :end', {
				start: params.createTime,
				end: day().toDate()
			})
		}

		// //状态筛选
		if (status !== undefined && status !== null) {
			QB.andWhere('user.status = :status', { status: params.status })
		}

		return await QB.getMany()
	}

	//切换权限状态
	async cutoverUser(params: UserDto.UserUid) {
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
	public async updateUserRole(params: UserDto.UpdateUserRoleDto): Promise<UserEntity> {
		try {
			const user = await this.userModel.findOne({ where: { uid: params.uid } })
			if (!user) {
				throw new HttpException('uid 错误', HttpStatus.BAD_REQUEST)
			}

			//修改role表数据
			const role = await this.roleModel.findOne({ where: { user } })
			if (role) {
				await this.roleModel.update({ user }, { ...params.role })
			} else {
				const roles = await this.roleModel.create({
					role_key: params.role.role_key,
					role_name: params.role.role_name,
					status: params.role.status
				})
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
			await this.storeService.delStore(String(params.uid))
			return await this.findUidUser(params.uid)
		} catch (error) {
			throw new HttpException(error.message || 'uid 错误', HttpStatus.BAD_REQUEST)
		}
	}

	//删除用户
	async deleteUser(params: UserDto.UserUid) {
		try {
			//查找uid对应的用户
			const user = await this.userModel.findOne({ where: { uid: params.uid } })
			if (user) {
				const delUser = await this.userModel.delete({ uid: params.uid }) //删除用户
				await this.storeService.delStore(String(params.uid))
				return delUser
			}
			throw new HttpException(`uid: ${params.uid} 错误`, HttpStatus.BAD_REQUEST)
		} catch (error) {
			throw new HttpException(error.message || error.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
