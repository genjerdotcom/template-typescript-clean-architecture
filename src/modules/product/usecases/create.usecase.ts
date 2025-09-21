import { injectable, inject } from 'tsyringe';
import { CreateProductDto } from '@app/modules/product/dtos';
import { ProductRepository } from '@app/modules/product/repositories/product.repository';
import { Product } from '@app/modules/product/domain/product.entity';
import { runInTransaction } from '@app/infrastructure/database/mongodb/base.transaction';

@injectable()
export class CreateProductUseCase {
    constructor(
        @inject('ProductRepository') private readonly productRepo: ProductRepository
    ) {}
    async execute(dto: CreateProductDto): Promise<Product> {
        const result = await runInTransaction(async (session) => {
            return this.productRepo.create({
                code: dto.code,
                name: dto.name,
                price: dto.price
            }, session);
        });

        return result;
    }
}
