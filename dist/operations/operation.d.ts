export declare class Operation {
    backend: any;
    constructor(backend: any);
    import(native: any): any;
    export(args: any): (native: any) => any;
    get(args: any): Promise<any>;
    post(args: any): Promise<any>;
    put(args: any): Promise<any>;
    delete(args: any): Promise<any>;
    getURL(args: any): string;
    getBaseURL(): void;
    getRequestPath(args: any): string;
    getRequest(args: any): string;
    postProcessor(args: any): (native: any) => any;
    doRequest(args: any): Promise<any>;
    translateResponse(data: any, arg1: any): void;
    getHeaders(): {};
}
