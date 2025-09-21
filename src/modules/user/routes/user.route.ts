import { container } from 'tsyringe';
import { UserCreateController, UserGetController, UserDetailController, UserUpdateController, UserDeleteController } from '@app/modules/user/controllers';
import { validateRequest } from '@app/presentation/http/middlewares';
import { CreateUserDto, DeleteUserDto, DetailUserDto, GetUserDto, UpdateUserDto } from '@app/modules/user/dtos';
import { AppRouteGroup } from '@app/presentation/http/types/routes.type';

const userCreateController = container.resolve(UserCreateController);
const userGetController = container.resolve(UserGetController);
const userDetailController = container.resolve(UserDetailController);
const userUpdateController = container.resolve(UserUpdateController);
const userDeleteController = container.resolve(UserDeleteController);

export const userRoutes: AppRouteGroup = {
    prefix: '/users',
    routes: [
        {
            method: 'post',
            path: '/',
            middleware: [],
            validator: [validateRequest(CreateUserDto)],
            handler: userCreateController.handle.bind(userCreateController),
        },
        {
            method: 'get',
            path: '/',
            middleware: [],
            validator: [validateRequest(GetUserDto)],
            handler: userGetController.handle.bind(userGetController),
        },
        {
            method: 'get',
            path: '/:id',
            middleware: [],
            validator: [validateRequest(DetailUserDto)],
            handler: userDetailController.handle.bind(userDetailController),
        },
        {
            method: 'patch',
            path: '/:id',
            middleware: [],
            validator: [validateRequest(UpdateUserDto)],
            handler: userUpdateController.handle.bind(userUpdateController),
        },
        {
            method: 'delete',
            path: '/:id',
            middleware: [],
            validator: [validateRequest(DeleteUserDto)],
            handler: userDeleteController.handle.bind(userDeleteController),
        },
    ],
};
