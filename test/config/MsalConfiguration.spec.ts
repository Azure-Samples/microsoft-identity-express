import { MsalConfiguration } from "../../src/config/MsalConfiguration";
import { TEST_APP_SETTINGS } from '../TestConstants';

describe('MSAL configuration builder tests', () => {
    it('should instantiate a valid msal configuration object', () => {

        const msalConfig = MsalConfiguration.getMsalConfiguration(TEST_APP_SETTINGS);
        expect(msalConfig).toBeDefined();
    });
})