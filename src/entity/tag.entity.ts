/*
 * @Author: 情雨随风
 * @Date: 2020-06-03 22:55:04
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-08 22:50:03
 * @Description: 标签表
 */

import { Entity, ManyToOne, ManyToMany, JoinTable } from 'typeorm'
import { PrimaryGeneratedColumn, Column } from 'typeorm'
import { UserEntity } from './user.entity'
import { ArticleEntity } from './article.entity'
import { ProjectEntity } from './project.entity'

@Entity('tag')
export class TagEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column({
		nullable: false,
		comment: '标签名称'
	})
	name: string

	@Column({
		nullable: false,
		comment: '标签颜色'
	})
	color: string

	@Column({
		default: () => 1,
		nullable: false,
		comment: '标签状态'
	})
	status: number

	@Column({
		default: () => 1,
		comment: '可置顶数值'
	})
	sort: number

	@Column({
		type: 'timestamp',
		comment: '创建时间',
		default: () => 'CURRENT_TIMESTAMP'
	})
	createTime: string

	@ManyToOne(
		//创建标签用户
		type => UserEntity,
		user => user.tag
	)
	user: UserEntity

	@ManyToMany(
		//标签拥有的文章
		type => ArticleEntity,
		article => article.tag,
		{ cascade: true }
	)
	@JoinTable()
	article: ArticleEntity[]

	@ManyToMany(
		//标签拥有的项目
		type => ProjectEntity,
		project => project.tag,
		{ cascade: true }
	)
	@JoinTable()
	project: ProjectEntity[]
}
