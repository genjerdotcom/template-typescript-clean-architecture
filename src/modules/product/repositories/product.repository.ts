import { BaseRepository, Models, Documents } from '@app/infrastructure/database';
import { Product } from '@app/modules/product/domain/product.entity';
import { injectable } from 'tsyringe';

@injectable()
export class ProductRepository extends BaseRepository<Product & Documents> {
    constructor(model: Models<Product & Documents>) {
        super(model);
    }
}
