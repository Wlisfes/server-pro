import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, BeforeInsert } from 'typeorm'
import * as day from 'dayjs'
import { hashSync } from 'bcryptjs'
import { ArticleEntity } from './article.entity'
import { RoleEntity } from './role.entity'

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

	// @Exclude()
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
		nullable: true
	})
	mobile: string | null

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
		role => role.user
	)
	role: RoleEntity
}
