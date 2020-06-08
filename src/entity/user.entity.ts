/*
 * @Author: 情雨随风
 * @Date: 2020-05-28 21:51:46
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-08 22:52:04
 * @Description: 用户表
 */

import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, BeforeInsert } from 'typeorm'
import { hashSync } from 'bcryptjs'
import { RoleEntity } from './role.entity'
import { AuthEntity } from './auth.entity'
import { TagEntity } from './tag.entity'
import { ArticleEntity } from './article.entity'
import { ProjectEntity } from './project.entity'

@Entity('user')
export class UserEntity {
	@BeforeInsert()
	async BeforeCreate() {
		this.uid = Date.now()
	}

	@PrimaryGeneratedColumn({ comment: '自增长主键' })
	id: number

	@Column({
		type: 'double',
		comment: 'uid',
		readonly: true
	})
	uid: number

	@Column({
		comment: '用户名',
		nullable: false
	})
	username: string

	@Column({
		comment: '密码',
		nullable: false,
		transformer: {
			from: value => value,
			to: value => hashSync(value)
		}
	})
	password: string

	@Column({
		comment: '昵称',
		nullable: false
	})
	nickname: string

	@Column({
		comment: '邮箱',
		nullable: true
	})
	email: string | null

	@Column({
		comment: '手机号',
		length: 11,
		nullable: true,
		transformer: {
			from: value => (value ? Number(value) : null),
			to: value => String(value)
		}
	})
	mobile: string

	@Column({
		comment: '头像',
		nullable: true
	})
	avatar: string | null

	@Column({
		comment: '状态',
		default: () => 1,
		nullable: false
	})
	status: number

	@Column({
		type: 'timestamp',
		comment: '创建时间',
		default: () => 'CURRENT_TIMESTAMP',
		nullable: false
	})
	createTime: string

	@OneToMany(
		//文章
		type => ArticleEntity,
		article => article.user,
		{ cascade: true }
	)
	article: ArticleEntity[]

	@OneToMany(
		//文章
		type => ProjectEntity,
		project => project.user,
		{ cascade: true }
	)
	project: ProjectEntity[]

	@OneToMany(
		//标签
		type => TagEntity,
		tag => tag.user,
		{ cascade: true }
	)
	tag: TagEntity[]

	@OneToOne(
		//角色
		type => RoleEntity,
		role => role.user,
		{ cascade: true }
	)
	role: RoleEntity

	@OneToMany(
		//权限
		type => AuthEntity,
		auth => auth.user,
		{ cascade: true }
	)
	auth: AuthEntity[]
}
