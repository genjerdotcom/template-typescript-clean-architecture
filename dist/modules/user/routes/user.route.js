"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const tsyringe_1 = require("tsyringe");
const controllers_1 = require("../../../modules/user/controllers");
const middlewares_1 = require("../../../presentation/http/middlewares");
const dtos_1 = require("../../../modules/user/dtos");
const userCreateController = tsyringe_1.container.resolve(controllers_1.UserCreateController);
const userGetController = tsyringe_1.container.resolve(controllers_1.UserGetController);
const userDetailController = tsyringe_1.container.resolve(controllers_1.UserDetailController);
const userUpdateController = tsyringe_1.container.resolve(controllers_1.UserUpdateController);
const userDeleteController = tsyringe_1.container.resolve(controllers_1.UserDeleteController);
exports.userRoutes = {
    prefix: '/users',
    routes: [
        {
            method: 'post',
            path: '/',
            middleware: [],
            validator: [(0, middlewares_1.validateRequest)(dtos_1.CreateUserDto)],
            handler: userCreateController.handle.bind(userCreateController),
        },
        {
            method: 'get',
            path: '/',
            middleware: [],
            validator: [(0, middlewares_1.validateRequest)(dtos_1.GetUserDto)],
            handler: userGetController.handle.bind(userGetController),
        },
        {
            method: 'get',
            path: '/:id',
            middleware: [],
            validator: [(0, middlewares_1.validateRequest)(dtos_1.DetailUserDto)],
            handler: userDetailController.handle.bind(userDetailController),
        },
        {
            method: 'patch',
            path: '/:id',
            middleware: [],
            validator: [(0, middlewares_1.validateRequest)(dtos_1.UpdateUserDto)],
            handler: userUpdateController.handle.bind(userUpdateController),
        },
        {
            method: 'delete',
            path: '/:id',
            middleware: [],
            validator: [(0, middlewares_1.validateRequest)(dtos_1.DeleteUserDto)],
            handler: userDeleteController.handle.bind(userDeleteController),
        },
    ],
};
