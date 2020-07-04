/*
 * @Date: 2020-06-09 08:48:17
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-22 15:29:54
 * @Description: 文章表
 */

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
		type: 'text',
		comment: '描述'
	})
	description: string

	@Column({
		nullable: false,
		comment: '封面'
	})
	picUrl: string

	@Column({
		nullable: false,
		comment: '代码风格'
	})
	themeName: string

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
	html: string

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

	@Column({
		type: 'timestamp',
		comment: '创建时间',
		default: () => 'CURRENT_TIMESTAMP',
		nullable: false
	})
	createTime: string

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
