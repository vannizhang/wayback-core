import {
    getWaybackServiceBaseURL,
    setDefaultWaybackOptions,
    getTileImageURL,
} from './';

import {
    WAYBACK_SERVICE_URL_TEMPLATE,
    WAYBACK_SERVICE_SUB_DOMAINS_DEV,
    WAYBACK_SERVICE_SUB_DOMAINS_PROD,
} from './';

describe('test getWaybackServiceBaseURL', () => {
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

describe('test getTileImageURL', () => {
    test('should return a URL from production subdomains with correct column, row and level', () => {
        const result = getTileImageURL({
            urlTemplate:
                'https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/10/{level}/{row}/{col}',
            column: 0,
            row: 0,
            level: 0,
        });

        const RESULT_TEMPLATE = `https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/10/0/0/0`;

        const expectedUrls = WAYBACK_SERVICE_SUB_DOMAINS_PROD.map((subDomain) =>
            RESULT_TEMPLATE.replace('wayback', subDomain)
        );

        expect(expectedUrls).toContain(result);
    });

    test('should return a URL from development subdomains with correct column, row and level', () => {
        // Mock shouldUseDevServices to return true
        setDefaultWaybackOptions({
            useDevServices: true,
        });

        const result = getTileImageURL({
            urlTemplate:
                'https://waybackdev.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/10/{level}/{row}/{col}',
            column: 0,
            row: 0,
            level: 0,
        });

        const RESULT_TEMPLATE = `https://waybackdev.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/10/0/0/0`;

        const expectedUrls = WAYBACK_SERVICE_SUB_DOMAINS_DEV.map((subDomain) =>
            RESULT_TEMPLATE.replace('waybackdev', subDomain)
        );

        expect(expectedUrls).toContain(result);
    });
});
