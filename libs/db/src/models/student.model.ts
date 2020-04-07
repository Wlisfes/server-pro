import { prop, modelOptions, Ref } from '@typegoose/typegoose'
import { ApiProperty } from '@nestjs/swagger'
import { modelsOptions } from '../utils'
import { School } from './school.model'

//学生
@modelOptions({
	schemaOptions: { ...modelsOptions }
})
export class Student {
	@ApiProperty({ description: '学生性名' })
	@prop({ required: true })
	name: string

	@ApiProperty({ description: '所属学校' })
	@prop({ ref: 'School' })
	school: Ref<School>
}
