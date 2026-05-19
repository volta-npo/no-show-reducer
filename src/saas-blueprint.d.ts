export declare const PRODUCT_ROLES: string[];
export declare const PRODUCT_INTEGRATIONS: string[];
export declare const PRODUCT_ANALYTICS: string[];
export declare const PRODUCT_WORKFLOWS: string[];
export declare const PRODUCT_GUARDS: string[];
export declare function createProductSaasBlueprint(config: any, domain: any): {
    product: any;
    northStar: any;
    roles: string[];
    integrations: string[];
    analytics: string[];
    workflows: string[];
    guards: string[];
    modules: any;
    artifacts: any;
};
