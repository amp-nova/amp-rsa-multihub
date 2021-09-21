import { Variant, GetAttributeArgs } from '@/schemas/types';
export declare class VariantResolver {
    attribute(variant: Variant, args: GetAttributeArgs): Promise<any>;
    defaultImage(variant: Variant): Promise<any>;
}
