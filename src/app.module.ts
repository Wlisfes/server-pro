import { Module } from '@nestjs/common'
import { AppController } from '@/app.controller'
import { AppService } from '@/app.service'
import { UserModule } from '@/module/user/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useFactory() {
				return {
					type: 'mysql',
					host: '120.25.123.165',
					port: 3306,
					username: 'paker',
					password: '77243',
					database: 'paker',
					entities: [__dirname + '/**/*.entity{.ts,.js}'],
					synchronize: true,
					dateStrings: true
				}
			}
		}),
		UserModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
