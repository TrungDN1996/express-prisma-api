import { createUser, getCurrentUser, login, updateUser } from '../../app/routes/auth/auth.service';
import { Body, Controller, Get, Middlewares, Path, Post, Put, Request, Route } from 'tsoa';
import { LoginDto, TokenUserDto, createUserDto } from '../../app/routes/auth/models';
import { auth } from '../../app/core/middlewares/auth.middleware';
import * as express from 'express';

@Route("users")
export class AuthController extends Controller {
  @Post()
  public async createUser(@Body() input: createUserDto): Promise<TokenUserDto> {
    return await createUser(input);
  }

  @Put(':id')
  public async updateUser(@Path() id: number, @Body() input: createUserDto): Promise<TokenUserDto> {
    return await updateUser(id, input);
  }

  @Post('login')
  public async login(@Body() input: LoginDto): Promise<TokenUserDto> {
    return await login(input);
  }

  @Get()
  @Middlewares(auth.required)
  public async getCurrentUser(@Request() req: express.Request): Promise<TokenUserDto> {
    return await getCurrentUser(req.auth?.user?.id);
  }
}