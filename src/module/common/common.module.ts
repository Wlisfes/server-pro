import { Module, Global } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DbModule } from '../db/db.module'
import { CommonService } from './common.service';

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		DbModule
	],
	providers: [CommonService]
})
export class CommonModule {}
