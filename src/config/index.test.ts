/* Copyright 2025 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
    getWaybackServiceBaseURL,
    setCustomWaybackConfig,
    getTileImageURL,
} from './';

import {
    WAYBACK_SERVICE_URL_TEMPLATE,
    // WAYBACK_SERVICE_SUB_DOMAINS_DEV,
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
        // setDefaultWaybackOptions({
        //     useDevServices: true,
        // });

        const customSubDomains = ['waybackdev'];

        setCustomWaybackConfig({
            subDomains: customSubDomains,
        });

        const result = getWaybackServiceBaseURL();

        const expectedUrls = customSubDomains.map((subDomain) =>
            WAYBACK_SERVICE_URL_TEMPLATE.replace('{subDomain}', subDomain)
        );

        expect(expectedUrls).toContain(result);
    });
});

describe('test getTileImageURL', () => {
    test('should return a URL from production subdomains with correct column, row and level', () => {
        setCustomWaybackConfig({
            subDomains: [],
        });

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

    test('should not replace subdomain if the URL template is custom even if subDomains are set', () => {
        // Mock shouldUseDevServices to return true
        setCustomWaybackConfig({
            subDomains: ['waybackdev-1', 'waybackdev-2', 'waybackdev-3'],
        });

        const result = getTileImageURL({
            urlTemplate:
                'https://waybackdev.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/10/{level}/{row}/{col}',
            column: 0,
            row: 0,
            level: 0,
        });

        const RESULT_TEMPLATE = `https://waybackdev.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/10/0/0/0`;

        // const expectedUrls = WAYBACK_SERVICE_SUB_DOMAINS_DEV.map((subDomain) =>
        //     RESULT_TEMPLATE.replace('waybackdev', subDomain)
        // );

        expect(result).toBe(RESULT_TEMPLATE);
    });
});
