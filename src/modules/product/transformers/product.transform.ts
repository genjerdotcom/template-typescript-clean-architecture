import { Product } from '@app/modules/product/domain/product.entity';
export class ProductTransformer {
    static transform(product: Product | null) {
        if (!product) return null;
        return {
            id: product._id,
            code: product.code,
            name: product.name,
            price: product.price
        };
    }

    static transformMany(products: Product[]) {
        return products.map((product) => this.transform(product));
    }

    static transformManyPaginate(data: { results: Product[]; count: number }) {
        return {
            data: this.transformMany(data.results),
            recordsTotal: data.count
        };
    }
}