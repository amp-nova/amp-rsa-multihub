import { Category } from 'amp-rsa-types';
import { GetCategoryArgs, GetCategoryProductArgs, Context } from '../../types';
export declare class CategoryResolver {
    category(args: GetCategoryArgs, ctx: Context): Promise<any>;
    categoryHierarchy(args: GetCategoryArgs, ctx: Context): Promise<any>;
    products(parent: Category, args: GetCategoryProductArgs, ctx: Context): Promise<any>;
}
