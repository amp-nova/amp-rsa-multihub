import { Category, GetCategoryArgs, GetCategoryProductArgs, Context } from '../schemas/types';
export declare class CategoryResolver {
    category(args: GetCategoryArgs, ctx: Context): Promise<any>;
    categoryHierarchy(args: GetCategoryArgs, ctx: Context): Promise<any>;
    products(parent: Category, args: GetCategoryProductArgs, ctx: Context): Promise<any>;
}
