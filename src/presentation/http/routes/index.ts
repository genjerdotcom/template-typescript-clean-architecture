import { Router } from 'express';
import { AppRouteGroup, AppRouteMethod } from '@app/presentation/http/types/routes.type';
import { routeGroups } from '@app/modules/register.http.routes';

const router = Router();

export const groupRoutes = (routeGroups: AppRouteGroup[]) => {
    routeGroups.forEach((group) => {
        const { prefix, routes } = group;

        routes.forEach((route) => {
            const middlewares = [
                ...(route.middleware ?? []),
                ...(route.validator ?? []),
            ];

            const method: AppRouteMethod = route.method;

            if (typeof router[method] === 'function') {
                router[method](`${prefix}${route.path}`, ...middlewares, route.handler);
            } else {
                throw new Error(`Invalid method ${method} in route ${prefix}${route.path}`);
            }
        });
    });
};


groupRoutes(routeGroups);

export { router };
