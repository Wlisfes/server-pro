export interface User {
	id: number
	uid: number
	username: string
	nickname: string
	status: number
	createTime: string
	password?: string
	email?: string | null
	mobile?: string | null
	avatar?: string | null
	article?: [] | null
	role?: any | null
}
