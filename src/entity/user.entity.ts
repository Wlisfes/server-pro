/*
 * @Author: 情雨随风
 * @Date: 2020-05-28 21:51:46
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-05-28 22:00:47
 * @Description: 用户表
 */

import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, BeforeInsert } from 'typeorm'
import { hashSync } from 'bcryptjs'
import { ArticleEntity } from './article.entity'
import { RoleEntity } from './role.entity'
import { AuthEntity } from './auth.entity'

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
			from: value => Number(value),
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
		type => ArticleEntity,
		article => article.user
	)
	article: ArticleEntity[]

	@OneToOne(
		type => RoleEntity,
		role => role.user,
		{ cascade: true }
	)
	role: RoleEntity

	@OneToMany(
		type => AuthEntity,
		auth => auth.user,
		{ cascade: true }
	)
	auth: AuthEntity[]
}
