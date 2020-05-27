import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { UserEntity } from './user.entity'

@Entity('article')
export class ArticleEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	name: string

	@ManyToOne(
		type => UserEntity,
		user => user.article
	)
	user: UserEntity
}
