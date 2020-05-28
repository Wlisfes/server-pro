import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm'
import { UserEntity } from './user.entity'

@Entity('role')
export class RoleEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ readonly: true, nullable: false })
	role_key: string

	@Column({ readonly: true, nullable: false })
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
		user => user.role,
		{ cascade: true }
	)
	@JoinColumn()
	user: UserEntity
}
