import { Module, Global } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { User } from './models/user'
import { UserRole } from './models/userRole'
import { Role } from './models/role'
import { Auth } from './models/auth'

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
	exports: [models]
})
export class DbModule {}
