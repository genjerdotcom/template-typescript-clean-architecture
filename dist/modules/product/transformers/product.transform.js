"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductTransformer = void 0;
class ProductTransformer {
    static transform(product) {
        if (!product)
            return null;
        return {
            id: product._id,
            code: product.code,
            name: product.name,
            price: product.price
        };
    }
    static transformMany(products) {
        return products.map((product) => this.transform(product));
    }
    static transformManyPaginate(data) {
        return {
            data: this.transformMany(data.results),
            recordsTotal: data.count
        };
    }
}
exports.ProductTransformer = ProductTransformer;
