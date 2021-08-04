import { ArgsType, Field } from 'type-graphql'

@ArgsType()
export class CommonArgs {
    @Field({ nullable: true })
    locale: string

    @Field({ nullable: true })
    currency: string
}

@ArgsType()
export class ListArgs extends CommonArgs {
    @Field({ nullable: true })
    limit: number

    @Field({ nullable: true })
    offset: number
}

export class Context {
    backendKey: string
    commercehub: any
}
