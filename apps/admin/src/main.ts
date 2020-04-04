import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { HttpExceptionFilter } from './filters/http-exception.filter'

//swagger文档
async function createSwagger(app) {
	const options = new DocumentBuilder()
		.setTitle('后台管理系统')
		.setDescription('后台管理系统Api')
		.setVersion('1.0')
		.build()
	const document = SwaggerModule.createDocument(app, options)
	SwaggerModule.setup('api-docs', app, document)
	return this
}

//server实列
async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule)

	//swagger文档挂载
	await createSwagger(app)

	//全局注册验证管道
	app.useGlobalPipes(new ValidationPipe())

	//全局注册错误的过滤器
	app.useGlobalFilters(new HttpExceptionFilter())

	await app.listen(3000)
	console.log('http://localhost:3000/api-docs')
}
bootstrap()
