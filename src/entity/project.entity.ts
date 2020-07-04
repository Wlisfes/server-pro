/*
 * @Author: 情雨随风
 * @Date: 2020-06-08 22:41:56
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-08 22:52:13
 * @Description: 项目表
 */

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from 'typeorm'
import { UserEntity } from './user.entity'
import { TagEntity } from './tag.entity'

@Entity('project')
export class ProjectEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column({
		nullable: false,
		comment: '标题'
	})
	title: string

	@Column({
		type: 'text',
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
		default: () => 0,
		comment: '点赞数量'
	})
	like: number

	@Column({
		nullable: false,
		comment: '项目地址'
	})
	github: string

	@Column({
		comment: '访问地址'
	})
	accessUrl: string

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
		//创建项目的用户
		type => UserEntity,
		user => user.project
	)
	user: UserEntity

	@ManyToMany(
		//项目所属标签
		type => TagEntity,
		tag => tag.project
	)
	tag: TagEntity[]
}
