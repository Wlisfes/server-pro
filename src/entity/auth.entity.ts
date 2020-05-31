/*
 * @Author: 情雨随风
 * @Date: 2020-05-28 21:52:19
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-05-28 23:40:01
 * @Description: 权限表
 */

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ValueTransformer } from 'typeorm'
import { UserEntity } from './user.entity'

const transformer: ValueTransformer = {
	from: value => {
		// if (value) {
		// 	JSON.parse(value)
		// }
		return value
	},
	to: value => {
		console.log('to', value)
		return (value as []).map(k => JSON.stringify(k))
	}
}

class Apply {
	key: string
	name: string
	status: number
}

@Entity('auth')
export class AuthEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ nullable: false })
	auth_key: string

	@Column({ nullable: false })
	auth_name: string

	@Column({ default: () => 1, nullable: false })
	status: number

	@Column({
		type: 'timestamp',
		comment: '创建时间',
		default: () => 'CURRENT_TIMESTAMP',
		nullable: false
	})
	createTime: string

	@Column('json-array')
	apply: Apply[]

	@ManyToOne(
		type => UserEntity,
		user => user.auth
	)
	user: UserEntity
}
