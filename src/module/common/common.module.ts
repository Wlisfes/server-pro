import { Module, Global } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DbModule } from '../db/db.module'

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		DbModule
	]
})
export class CommonModule {}
