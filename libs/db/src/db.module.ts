import { Module, Global } from '@nestjs/common'
import { DbService } from './db.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { User } from './models/user'
import { Role } from './models/role'
import { Auth } from './models/auth'
import { UserRole } from './models/userRole'

const models = TypegooseModule.forFeature([User, UserRole, Role, Auth])

@Global()
@Module({
	imports: [
		TypegooseModule.forRootAsync({
			useFactory() {
				return {
					uri: process.env.DB,
					useNewUrlParser: true,
					useUnifiedTopology: true,
					useCreateIndex: true,
					useFindAndModify: false
				}
			}
		}),
		models
	],
	providers: [DbService],
	exports: [DbService, models]
})
export class DbModule {}
