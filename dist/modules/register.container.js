"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const tsyringe_1 = require("tsyringe");
const user_schema_1 = require("../modules/user/schema/user.schema");
const product_schema_1 = require("../modules/product/schema/product.schema");
const user_repository_1 = require("../modules/user/repositories/user.repository");
const product_repository_1 = require("../modules/product/repositories/product.repository");
const controllers_1 = require("../modules/user/controllers");
const usecases_1 = require("../modules/user/usecases");
const usecases_2 = require("../modules/product/usecases");
const controllers_2 = require("../modules/product/controllers");
// ============= users =============
tsyringe_1.container.register('UserRepository', { useFactory: () => new user_repository_1.UserRepository(user_schema_1.UserModel) });
tsyringe_1.container.registerSingleton('CreateUserUseCase', usecases_1.CreateUserUseCase);
tsyringe_1.container.register('UserCreateController', { useClass: controllers_1.UserCreateController });
tsyringe_1.container.registerSingleton('GetUserUseCase', usecases_1.GetUserUseCase);
tsyringe_1.container.register('UserGetController', { useClass: controllers_1.UserGetController });
tsyringe_1.container.registerSingleton('DetailUserUseCase', usecases_1.DetailUserUseCase);
tsyringe_1.container.register('UserDetailController', { useClass: controllers_1.UserDetailController });
tsyringe_1.container.registerSingleton('UpdateUserUseCase', usecases_1.UpdateUserUseCase);
tsyringe_1.container.register('UserUpdateController', { useClass: controllers_1.UserUpdateController });
tsyringe_1.container.registerSingleton('DeleteUserUseCase', usecases_1.DeleteUserUseCase);
tsyringe_1.container.register('UserDeleteController', { useClass: controllers_1.UserDeleteController });
// ============= product =============
tsyringe_1.container.register('ProductRepository', { useFactory: () => new product_repository_1.ProductRepository(product_schema_1.ProductModel) });
tsyringe_1.container.registerSingleton('CreateProductUseCase', usecases_2.CreateProductUseCase);
tsyringe_1.container.register('ProductCreateController', { useClass: controllers_2.ProductCreateController });
