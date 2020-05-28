import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { HttpExceptionFilter } from '@/filters/http-exception.filter'
import { TransformInterceptor } from '@/interceptor/transform.interceptor'
import { AppModule } from '@/app.module'

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

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule)

	//swagger文档挂载
	await createSwagger(app)

	//全局注册验证管道
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true
		})
	)

	//全局注册错误的过滤器
	app.useGlobalFilters(new HttpExceptionFilter())

	//全局注册拦截器更改返回数据格式
	app.useGlobalInterceptors(new TransformInterceptor())

	const port = process.env.ADMIN_PORT || 3003
	await app.listen(port)
	console.log(`http://localhost:${port}/`)
	console.log(`http://localhost:${port}/api-docs`)
}
bootstrap()
