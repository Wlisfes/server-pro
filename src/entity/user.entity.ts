import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('user')
export class UserEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column({
		nullable: false,
		primary: true,
		generated: 'uuid',
		length: 50,
		name: 'uid',
		comment: 'uid',
		readonly: true
	})
	uid: string

	@Column()
	username: string

	@Column()
	password: string
}
