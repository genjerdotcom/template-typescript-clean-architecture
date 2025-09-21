import { injectable, inject } from 'tsyringe';
import { CreateProductUseCase } from '@app/modules/product/usecases/create.usecase';
import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js';
import { CreateProductDto } from '@app/modules/product/dtos';
import { plainToInstance } from 'class-transformer';
import { Product } from '@app/modules/product/domain/product.entity';
import { GrpcResponse } from '@app/presentation/grpc/responses';
import { ProductTransformer } from '../transformers/product.transform';

@injectable()
export class ProductCreateController {
    constructor(
        @inject('CreateProductUseCase') private readonly createProductUseCase: CreateProductUseCase
    ) {}

    async handle(
        call: ServerUnaryCall<CreateProductDto, Product>,
        callback: sendUnaryData<Product>
    ) {
        const dto = plainToInstance(CreateProductDto, call.request);
        const result = await this.createProductUseCase.execute(dto);
        const transform = ProductTransformer.transform(result);
        return GrpcResponse.created(callback, 'Product created successfully', transform);
    }
}
