import * as OSS from 'ali-oss'

export interface UploadResult {
	upload: boolean
	url: string
	name: string
	path: string
	message: string
}

export interface File {
	fieldname: string
	originalname: string
	encoding: string
	mimetype: string
	buffer: Buffer
	size: number
}

export interface OSSSucessResponse {
	name: string
	url?: string
	res: OSS.NormalSuccessResponse
	size?: number
	aborted?: boolean
	rt?: number
	keepAliveSocket?: boolean
	data?: Buffer
	requestUrls?: string[]
	timing?: null
	remoteAddress?: string
	remotePort?: number
	socketHandledRequests?: number
	socketHandledResponses?: number
}
