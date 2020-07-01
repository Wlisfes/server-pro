/*
 * @Date: 2020-05-29 16:53:21
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2020-05-29 16:53:37
 * @Description: 动态日志
 */

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { UserEntity } from './user.entity'

@Entity('logger')
export class LoggerEntity {
	@PrimaryGeneratedColumn({ comment: '自增长主键' })
	id: number

	@Column({ type: 'double', comment: '动态对应数据id' })
	commonid: number

	@Column({ comment: '动态类型描述', nullable: true })
	content: string

	@Column({ type: 'text', comment: '动态说明', nullable: true })
	context: string

	@Column({
		type: 'timestamp',
		comment: '创建时间',
		default: () => 'CURRENT_TIMESTAMP',
		nullable: false
	})
	createTime: string

	@ManyToOne(
		//创建动态的用户
		type => UserEntity,
		user => user.logger
	)
	user: UserEntity
}
