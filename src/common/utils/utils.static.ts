//数据库表
export type key = 'user' | 'tag' | 'article' | 'auth' | 'role' | 'project' | 'notes'

//用户表字段
export const user = [
	'id',
	'uid',
	'username',
	'nickname',
	'avatar',
	'email',
	'mobile',
	'status',
	'createTime',
	'article',
	'project',
	'notes',
	'tag',
	'role',
	'auth'
]

//标签表字段
export const tag = ['id', 'name', 'color', 'status', 'sort', 'createTime', 'user', 'article', 'notes', 'project']

//文章表字段
export const article = [
	'id',
	'title',
	'description',
	'picUrl',
	'themeName',
	'content',
	'html',
	'reading',
	'status',
	'sort',
	'createTime',
	'user',
	'tag'
]

//权限表
export const auth = ['id', 'auth_key', 'auth_name', 'status', 'all', 'createTime', 'apply', 'user']

//角色表
export const role = ['id', 'role_key', 'role_name', 'status', 'createTime', 'user']

//项目表
export const project = [
	'id',
	'title',
	'description',
	'picUrl',
	'like',
	'github',
	'accessUrl',
	'status',
	'sort',
	'createTime',
	'user',
	'tag'
]

//笔记表
export const notes = [
	'id',
	'title',
	'picUrl',
	'themeName',
	'content',
	'html',
	'status',
	'sort',
	'createTime',
	'user',
	'tag'
]
