import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { jwtDecode } from 'jwt-decode';
import { Request } from 'express';

export const Email = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const token = extractTokenFromHeader(request)
  if (!token) return null
  const decoded = jwtDecode<{ email: string }>(token)
  return decoded?.email || null
});

function extractTokenFromHeader(request: Request): string | undefined {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}