/*
 * @Author: 情雨随风
 * @Date: 2020-04-06 22:49:03
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-05-10 23:40:53
 * @Description: 工具函数
 */

import * as day from 'dayjs'

//数据库表配置
export const modelsOptions = {
	timestamps: {
		createdAt: 'create_time', //重命名创建时间
		updatedAt: 'update_time' //重命名更新时间
	},
	versionKey: false,
	toJSON: {
		getters: true,
		transform(doc, ret, options) {
			ret.id = doc.id
			delete ret._id

			ret.update_time = day(doc.update_time).format('YYYY-MM-DD HH:mm:ss')
			ret.create_time = day(doc.create_time).format('YYYY-MM-DD HH:mm:ss')
			return ret
		}
	}
}
