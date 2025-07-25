import { Hono } from "hono";
import { cors } from "hono/cors"
import type { ContextVariables } from "../constants";
import { API_PREFIX, CLIANT_ORIGIN } from "../constants";
import { attachUserId, checkJWTAuth } from "../middlewares/auth";
import { AUTH_PREFIX, createAuthApp } from "./auth";
import { CHAT_PREFIX, createChatApp } from "./chat";
import { env } from 'cloudflare:workers'
import { UserSQLResource, ChatSQLResource, MessageSQLResource } from "../storage/sql";

export function createMainApp(
    authApp: Hono<ContextVariables>,
    chatApp: Hono<ContextVariables>,
) {
    const app = new Hono<ContextVariables>().basePath(API_PREFIX);

    app.use("*", cors({origin: CLIENT_ORIGIN}));
    app.use("*", checkJWTAuth);
    app.use("*", attachUserId);
    app.route(AUTH_PREFIX, authApp);
    app.route(CHAT_PREFIX, chatApp);

    return app;
}

export function createSQLApp() {
    const userRes = new UserSQLResource(env.DB);
    const chatRes = new ChatSQLResource(env.DB);
    const messageRes = new MessageSQLResource(env.DB);

    const authApp = createAuthApp(userRes);
    const chatApp = createChatApp(chatRes, messageRes);

    return createMainApp(authApp, chatApp);
}

