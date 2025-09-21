import 'reflect-metadata';
import { container } from 'tsyringe';

import { UserModel } from '@app/modules/user/schema/user.schema';
import { ProductModel } from '@app/modules/product/schema/product.schema';

import { UserRepository } from '@app/modules/user/repositories/user.repository';
import { ProductRepository } from '@app/modules/product/repositories/product.repository';

import { UserCreateController, UserDetailController, UserGetController, UserUpdateController, UserDeleteController } from '@app/modules/user/controllers';
import { CreateUserUseCase, DetailUserUseCase, GetUserUseCase, UpdateUserUseCase, DeleteUserUseCase } from '@app/modules/user/usecases';

import { CreateProductUseCase } from '@app/modules/product/usecases';
import { ProductCreateController } from '@app/modules/product/controllers';

// ============= users =============
container.register('UserRepository', { useFactory: () => new UserRepository(UserModel) });

container.registerSingleton('CreateUserUseCase', CreateUserUseCase );
container.register('UserCreateController', { useClass: UserCreateController });

container.registerSingleton('GetUserUseCase', GetUserUseCase );
container.register('UserGetController', { useClass: UserGetController });

container.registerSingleton('DetailUserUseCase', DetailUserUseCase );
container.register('UserDetailController', { useClass: UserDetailController });

container.registerSingleton('UpdateUserUseCase', UpdateUserUseCase );
container.register('UserUpdateController', { useClass: UserUpdateController });

container.registerSingleton('DeleteUserUseCase', DeleteUserUseCase );
container.register('UserDeleteController', { useClass: UserDeleteController });

// ============= product =============
container.register('ProductRepository', { useFactory: () => new ProductRepository(ProductModel) });

container.registerSingleton('CreateProductUseCase', CreateProductUseCase );
container.register('ProductCreateController', { useClass: ProductCreateController });

