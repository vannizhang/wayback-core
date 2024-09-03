import { getWaybackServiceBaseURL, setDefaultWaybackOptions } from './';

import {
    WAYBACK_SERVICE_URL_TEMPLATE,
    WAYBACK_SERVICE_SUB_DOMAINS_DEV,
    WAYBACK_SERVICE_SUB_DOMAINS_PROD,
} from './';

describe('test getWaybackServiceBaseURL', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return a URL from production subdomains', () => {
        const result = getWaybackServiceBaseURL();

        const expectedUrls = WAYBACK_SERVICE_SUB_DOMAINS_PROD.map((subDomain) =>
            WAYBACK_SERVICE_URL_TEMPLATE.replace('{subDomain}', subDomain)
        );

        expect(expectedUrls).toContain(result);
    });

    test('should select a random subdomain', () => {
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.5);

        const result = getWaybackServiceBaseURL();

        expect(randomSpy).toHaveBeenCalled();
        expect(result).toBe(
            WAYBACK_SERVICE_URL_TEMPLATE.replace(
                '{subDomain}',
                WAYBACK_SERVICE_SUB_DOMAINS_PROD[1] // Assuming this index is selected by Math.random()
            )
        );

        randomSpy.mockRestore();
    });

    test('should return a URL from development subdomains', () => {
        // Mock shouldUseDevServices to return true
        setDefaultWaybackOptions({
            useDevServices: true,
        });

        const result = getWaybackServiceBaseURL();

        const expectedUrls = WAYBACK_SERVICE_SUB_DOMAINS_DEV.map((subDomain) =>
            WAYBACK_SERVICE_URL_TEMPLATE.replace('{subDomain}', subDomain)
        );

        expect(expectedUrls).toContain(result);
    });
});
