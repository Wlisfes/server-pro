import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from 'typeorm'
import { UserEntity } from './user.entity'
import { TagEntity } from './tag.entity'

@Entity('article')
export class ArticleEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	name: string

	@ManyToOne(
		//创建文章的用户
		type => UserEntity,
		user => user.article
	)
	user: UserEntity

	@ManyToMany(
		//文章所属标签
		type => TagEntity,
		tag => tag.article
	)
	tag: TagEntity[]
}
