import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from 'typeorm'
import { UserEntity } from './user.entity'
import { TagEntity } from './tag.entity'

@Entity('article')
export class ArticleEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column({
		nullable: false,
		comment: '标题'
	})
	title: string

	@Column({
		nullable: false,
		comment: '描述'
	})
	description: string

	@Column({
		nullable: false,
		comment: '封面'
	})
	picUrl: string

	@Column({
		type: 'text',
		nullable: false,
		comment: '原始内容'
	})
	content: string

	@Column({
		type: 'text',
		nullable: false,
		comment: '文本内容'
	})
	text: string

	@Column({
		comment: '阅读数',
		default: () => 0
	})
	reading: number

	@Column({
		default: () => 1,
		nullable: false,
		comment: '状态'
	})
	status: number

	@Column({
		default: () => 1,
		comment: '置顶权重'
	})
	sort: number

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
