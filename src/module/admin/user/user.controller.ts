import { Controller, Get, Post, Body, Put, Delete, Query, Session, Response, Req } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { UserService } from '@/module/admin/user/user.service'
import { AuthUser, AuthRole } from '@/guard/auth.guard'
import * as UserDto from '@/module/admin/user/user.dto'

const path = `${process.env.ADMINPREFIX}/user`

@Controller(path)
@ApiTags('用户模块')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiOperation({ summary: '验证码' })
	@Get('code')
	public async svgCode(@Session() session: { code: string }, @Response() res): Promise<any> {
		const Code = await this.userService.svgCode()
		session.code = Code.text.toUpperCase()
		res.type('svg')
		res.send(Code.data)
	}

	@ApiOperation({ summary: '登录' })
	@Post('login')
	async loginUser(
		@Session() session: { code: string },
		@Body() body: UserDto.LoginUserDto,
		@Req() req: { ipv4: string }
	) {
		return await this.userService.loginUser(body, session.code, req.ipv4)
	}

	@ApiOperation({ summary: '创建用户' })
	@Post('create')
	async createUser(@Session() session: { code: string }, @Body() body: UserDto.CreateUserDto) {
		return await this.userService.createUser(body, session.code)
	}

	@ApiOperation({ summary: '获取所有用户列表' })
	@Get('all')
	@AuthUser(true)
	@AuthRole({ key: 'user', apply: 'query' })
	async findUserAll(@Query() query: UserDto.FindUserDto) {
		return await this.userService.findUserAll(query)
	}

	@ApiOperation({ summary: '获取用户详情' })
	@Get('info')
	@AuthUser(true)
	@AuthRole({ key: 'user', apply: 'get' })
	async findUidUser(@Query() query: UserDto.UserUid) {
		return await this.userService.findUidUser(query.uid)
	}

	@ApiOperation({ summary: '修改用户角色权限' })
	@Put('update/role')
	@AuthUser(true)
	@AuthRole({ key: 'user', apply: 'update' })
	async updateUserRole(@Body() body: UserDto.UpdateUserRoleDto) {
		return await this.userService.updateUserRole(body)
	}

	@ApiOperation({ summary: '修改用户信息' })
	@Put('update')
	@AuthUser(true)
	@AuthRole({ key: 'user', apply: 'update' })
	async updateUser(@Body() body: UserDto.UpdateUserDto) {
		return this.userService.updateUser(body)
	}

	@ApiOperation({ summary: '修改用户头像' })
	@Put('update/avatar')
	@AuthUser(true)
	@AuthRole({ key: 'user', apply: 'update' })
	async updateUserAvatar(@Body() body: UserDto.UserAvatarDto) {
		return this.userService.updateUserAvatar(body)
	}

	@ApiOperation({ summary: '切换用户状态' })
	@Put('cutover')
	@AuthUser(true)
	@AuthRole({ key: 'user', apply: 'update' })
	async cutoverUser(@Query() query: UserDto.UserUid) {
		return await this.userService.cutoverUser(query)
	}

	@ApiOperation({ summary: '删除用户' })
	@Delete('delete')
	@AuthUser(true)
	@AuthRole({ key: 'user', apply: 'delete' })
	async deleteUser(@Query() query: UserDto.UserUid) {
		return await this.userService.deleteUser(query)
	}
}
