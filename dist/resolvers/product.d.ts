import { GetProductArgs, GetProductsArgs, Context } from '@/schemas/types';
export declare class ProductResolver {
    products(args: GetProductsArgs, ctx: Context): Promise<any>;
    product(args: GetProductArgs, ctx: Context): Promise<any>;
}
