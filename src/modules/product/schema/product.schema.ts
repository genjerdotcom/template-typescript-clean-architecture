import { CreateModel, Documents } from '@app/infrastructure/database';
import { Product } from '@app/modules/product/domain/product.entity';

export const ProductModel = CreateModel<Product & Documents>(
    'product',
    {
        code: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
    },
    { timestamps: true },
    [
        {
            fields: { code: 1, name: 1 },
            options: { unique: true, name: 'code_name_unique' },
        },
    ]
);