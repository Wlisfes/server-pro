import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const options = new DocumentBuilder()
		.setTitle('后台管理系统')
		.setDescription('The cats API description')
		.setVersion('1.0')
		.build()
	const document = SwaggerModule.createDocument(app, options)
	SwaggerModule.setup('api-docs', app, document)

	await app.listen(3000)
	console.log('http://localhost:3000/api-docs')
}
bootstrap()
