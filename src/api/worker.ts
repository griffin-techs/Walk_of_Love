import { app } from "./app";

export default {
  fetch(request: Request, env: unknown, ctx: ExecutionContext): Promise<Response> | Response {
    return app.fetch(request, env as never, ctx);
  },
};
