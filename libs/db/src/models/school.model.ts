import { prop, modelOptions, arrayProp, Ref } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'
import { modelsOptions } from '../utils'
import { Student } from './student.model'

//学校
@modelOptions({
	schemaOptions: { ...modelsOptions }
})
export class School {
	@ApiProperty({ description: '学生性名' })
	@prop({ required: true })
	name: string

	@ApiProperty({ description: '学生列表' })
	@arrayProp({
		ref: 'Student',
		localField: '_id',
		foreignField: 'school'
	})
	student: Ref<Student>
}
