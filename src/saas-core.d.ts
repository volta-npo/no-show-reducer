export declare const SAAS_STAGES: string[];
export declare const SAAS_STAGE_WEIGHTS: Readonly<{
    discover: 0.18;
    onboard: 0.38;
    configure: 0.58;
    validate: 0.78;
    launch: 0.92;
    expand: 1;
}>;
export declare const SAAS_TIERS: Readonly<{
    starter: 1200;
    growth: 3200;
    scale: 6400;
}>;
export declare function createSaasState(config: any, domain: any, now?: string): {
    version: string;
    createdAt: string;
    updatedAt: string;
    northStar: any;
    accounts: {
        id: string;
        name: any;
        segment: string;
        tier: string;
        stage: string;
        health: number;
        seats: number;
        owner: string;
        renewalDate: string;
        risk: string;
        notes: string;
    }[];
    playbooks: any;
    automations: {
        id: string;
        trigger: string;
        action: string;
        metric: string;
        enabled: boolean;
        humanReview: boolean;
        risk: string;
        lastRun: string;
    }[];
    plans: any;
    blueprint: {
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
    experiments: {
        id: string;
        name: string;
        hypothesis: string;
        status: string;
        target: number;
    }[];
};
export declare function calculateSaasMetrics(config: any, domain: any, state: any): {
    totalMrr: any;
    avgHealth: number;
    activationRate: number;
    automationCoverage: number;
    playbookReadiness: number;
    launchScore: number;
    stageSummary: {
        stage: string;
        count: any;
    }[];
    nextBestActions: any[];
    launchReady: boolean;
};
export declare function validateSaasState(config: any, domain: any, state: any): boolean;
export declare function generateSaasArtifacts(config: any, domain: any, state: any): {
    title: string;
    body: string;
}[];
export declare function buildSaasMarkdown(config: any, domain: any, state: any): string;
export declare function buildSaasCsv(state: any): string;
export declare function applySaasSample(config: any, domain: any): {
    version: string;
    createdAt: string;
    updatedAt: string;
    northStar: any;
    accounts: {
        id: string;
        name: any;
        segment: string;
        tier: string;
        stage: string;
        health: number;
        seats: number;
        owner: string;
        renewalDate: string;
        risk: string;
        notes: string;
    }[];
    playbooks: any;
    automations: {
        id: string;
        trigger: string;
        action: string;
        metric: string;
        enabled: boolean;
        humanReview: boolean;
        risk: string;
        lastRun: string;
    }[];
    plans: any;
    blueprint: {
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
    experiments: {
        id: string;
        name: string;
        hypothesis: string;
        status: string;
        target: number;
    }[];
};
