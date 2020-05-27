import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '@/entity/user.entity'
import { ArticleEntity } from '@/entity/article.entity'
import { RoleEntity } from '@/entity/role.entity'

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
		@InjectRepository(ArticleEntity) private readonly articleModel: Repository<ArticleEntity>,
		@InjectRepository(RoleEntity) private readonly roleModel: Repository<RoleEntity>
	) {}

	public async createUser() {
		const user = await this.userModel.create({
			username: 'admin',
			password: '3633',
			nickname: '情雨随风'
		})
		return await this.userModel.save(user)
	}

	public async findUserAll() {
		return await this.userModel.find({ relations: ['article', 'role'] })
	}

	public async findArticleAll() {
		return await this.articleModel.find()
	}

	public async updateUserRole() {
		// const user = await this.userModel.findOne({ where: { id: 1 } })
		// const role = await this.roleModel.create([{ name: '西莉卡' }, { name: '莉法' }])
		// const saveRole = await this.roleModel.save({
		// 	...role,
		// 	user
		// })

		// return saveRole

		//update修改
		try {
			const role = await this.roleModel.findOne({ where: { id: 2 } })
			if (!role) {
				throw new HttpException('id 不存在', HttpStatus.BAD_REQUEST)
			} else {
				// await this.roleModel.update(role, { name: '亚丝娜' })
				console.log(await this.roleModel.find())
				return await this.roleModel.findOne(role.id)
			}
		} catch (error) {
			throw new HttpException(error.message || 'id 不存在', HttpStatus.BAD_REQUEST)
		}
	}

	public async updateUserArticle() {
		const user = await this.userModel.findOne({ where: { id: 1 } })
		const article = await this.articleModel.create([{ name: 'Angular' }, { name: 'Vue' }, { name: 'React' }])
		const newArticle = await this.articleModel.save(article.map(k => ({ ...k, user })))

		// user.article = user.article.concat(article)

		// await this.userModel.update({ id: user.id }, user)

		return newArticle
	}
}
