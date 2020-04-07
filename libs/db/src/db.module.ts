import { Module, Global } from '@nestjs/common'
import { DbService } from './db.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { User } from './models/user.model'
import { Role } from './models/role.model'
import { Permission } from './models/permission.model'
import { Apply } from './models/apply.model'
import { School } from './models/school.model'
import { Student } from './models/student.model'
import { Actions } from './models/actions.model'

const models = TypegooseModule.forFeature([User, Role, Apply, Permission, Actions, School, Student])

@Global()
@Module({
	imports: [
		TypegooseModule.forRoot('mongodb://120.25.123.165:27017/server_pro', {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false
		}),
		models
	],
	providers: [DbService],
	exports: [DbService]
})
export class DbModule {}
