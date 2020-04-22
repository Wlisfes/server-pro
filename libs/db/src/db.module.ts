import { Module, Global } from '@nestjs/common'
import { DbService } from './db.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { User } from './models/user'
import { Role } from './models/role'
import { Auth } from './models/auth'

const models = TypegooseModule.forFeature([User, Role, Auth])

@Global()
@Module({
	imports: [
		TypegooseModule.forRoot('mongodb://120.25.123.165:27017/server-pro', {
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
