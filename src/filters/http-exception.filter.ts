import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common'
import * as day from 'dayjs'

@Catch(HttpException)
export class HttpExceptionFilter<T> implements ExceptionFilter {
	catch(exception: T, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse()
		const request = ctx.getRequest()

		const { error, message } = (exception => {
			var useError = (exception as any).response
			var message
			if (typeof useError === 'object') {
				message = Array.isArray(useError.message) ? useError.message[0] : useError.message
			} else {
				message = useError
			}
			return {
				error: useError,
				message
			}
		})(exception)

		Logger.warn('错误提示', JSON.stringify(error))

		const errorResponse = {
			data: {
				error: error //全部错误消息
			},
			timestamp: day().format('YYYY-MM-DD HH:mm:ss'),
			message: message,
			code: (exception as any).response.statusCode || (exception as any).status, //错误状态码
			url: request.url, // 错误的url地址
			method: request.method
		}
		const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
		// 设置返回的状态码、请求头、发送错误信息
		response.status(status)
		response.header('Content-Type', 'application/json; charset=utf-8')
		response.send(errorResponse)
	}
	x
}
