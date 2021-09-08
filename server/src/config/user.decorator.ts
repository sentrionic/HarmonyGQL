import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): number => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.session.userId;
  },
);
