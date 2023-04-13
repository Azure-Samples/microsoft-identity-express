import { test as base } from '@playwright/test';

export type TestOptions = {
    output: string;
    port: string;
};


export const test = base.extend<TestOptions>({
    // Define an option and provide a default value.
    // We can later override it in the config.
    output: ['output', { option: true }],
    port: ["000", {option: true}],
});
