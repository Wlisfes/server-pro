/*
 * @Author: 情雨随风
 * @Date: 2020-06-03 22:55:04
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-03 23:19:53
 * @Description: 标签表
 */

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm'
import { UserEntity } from './user.entity'
import { ArticleEntity } from './article.entity'

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
		default: () => 'CURRENT_TIMESTAMP',
		nullable: false
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
		article => article,
		{ cascade: true }
	)
	@JoinTable()
	article: ArticleEntity[]
}
