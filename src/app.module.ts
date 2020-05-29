import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from '@/app.controller'
import { AppService } from '@/app.service'
import { UserModule } from '@/module/user/user.module'
import { RoleModule } from '@/module/role/role.module'
import { OssModule } from '@/module/oss/oss.module'
import { SignModule } from '@/module/sign/sign.module'

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
		OssModule,
		UserModule,
		RoleModule,
		SignModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
