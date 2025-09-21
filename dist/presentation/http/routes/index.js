"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = exports.groupRoutes = void 0;
const express_1 = require("express");
const register_http_routes_1 = require("../../../modules/register.http.routes");
const router = (0, express_1.Router)();
exports.router = router;
const groupRoutes = (routeGroups) => {
    routeGroups.forEach((group) => {
        const { prefix, routes } = group;
        routes.forEach((route) => {
            const middlewares = [
                ...(route.middleware ?? []),
                ...(route.validator ?? []),
            ];
            const method = route.method;
            if (typeof router[method] === 'function') {
                router[method](`${prefix}${route.path}`, ...middlewares, route.handler);
            }
            else {
                throw new Error(`Invalid method ${method} in route ${prefix}${route.path}`);
            }
        });
    });
};
exports.groupRoutes = groupRoutes;
(0, exports.groupRoutes)(register_http_routes_1.routeGroups);
