/*
 * @Author: 情雨随风
 * @Date: 2020-05-28 21:52:05
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-05-28 21:56:16
 * @Description: 角色表
 */

import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm'
import { UserEntity } from './user.entity'

@Entity('role')
export class RoleEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ nullable: false })
	role_key: string

	@Column({ nullable: false })
	role_name: string

	@Column({ default: () => 1, nullable: false })
	status: number

	@Column({
		type: 'timestamp',
		comment: '创建时间',
		default: () => 'CURRENT_TIMESTAMP',
		nullable: false
	})
	createTime: string

	@OneToOne(
		type => UserEntity,
		user => user.role
	)
	@JoinColumn()
	user: UserEntity
}
