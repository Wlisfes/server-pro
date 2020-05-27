import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm'
import { UserEntity } from './user.entity'

@Entity('role')
export class RoleEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	name: string

	@OneToOne(
		type => UserEntity,
		user => user.role,
		{ cascade: true }
	)
	@JoinColumn()
	user: UserEntity
}
