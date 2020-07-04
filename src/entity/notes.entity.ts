/*
 * @Date: 2020-06-22 15:29:39
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-06-23 09:43:21
 * @Description: 笔记表
 */

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from 'typeorm'
import { UserEntity } from './user.entity'
import { TagEntity } from './tag.entity'

@Entity('notes')
export class NotesEntity {
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
		//创建笔记的用户
		type => UserEntity,
		user => user.notes
	)
	user: UserEntity

	@ManyToMany(
		//笔记所属标签
		type => TagEntity,
		tag => tag.notes
	)
	tag: TagEntity[]
}
