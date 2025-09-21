import { RequestHandler } from 'express';

export type AppRouteMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface AppRoute {
    method: AppRouteMethod;
    path: string;
    handler: RequestHandler;
    middleware?: RequestHandler[];
    validator?: RequestHandler[];
}

export interface AppRouteGroup {
    prefix: string;
    routes: AppRoute[];
}
