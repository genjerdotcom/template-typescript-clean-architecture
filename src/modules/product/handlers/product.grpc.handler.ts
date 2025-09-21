import { container } from 'tsyringe';
import { ProductCreateController } from '@app/modules/product/controllers';
import { GrpcHandlerGroup } from '@app/presentation/grpc/types/handler.type';
import { grpcValidateRequest } from '@app/presentation/grpc/interceptors/validator.interceptor';
import { composeInterceptors } from '@app/presentation/grpc/interceptors/compose.interceptor';
import { CreateProductDto } from '@app/modules/product/dtos';
import { Product } from '@app/modules/product/domain/product.entity';

const productCreateController = container.resolve(ProductCreateController);

export const productGrpcHandler: GrpcHandlerGroup = {
    moduleName: 'product',
    serviceName: 'ProductService',
    handlers: {
        CreateProduct: composeInterceptors<CreateProductDto, Product>(
            [grpcValidateRequest(CreateProductDto)],
            productCreateController.handle.bind(productCreateController)
        ),
    },
};
