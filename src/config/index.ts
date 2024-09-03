type SetDefaultOptionsParams = {
    /**
     * if true, use dev wayback services
     */
    useDevServices?: boolean;
};

type GetTileImageURLParams = {
    /**
     * URL template for a specific Wayback release, provided by the Wayback configuration file.
     * The template should include placeholders for level, row, and column.
     * @example 'https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/10/{level}/{row}/{col}'
     */
    urlTemplate: string;
    column: number;
    row: number;
    level: number;
};

/**
 * An array of subDomain names for production wayback service.
 * Using different subDomains helps to speed up tile retrieval.
 */
export const WAYBACK_SERVICE_SUB_DOMAINS_PROD = [
    'wayback',
    'wayback-a',
    'wayback-b',
];

/**
 * An array of subDomain names for development wayback service.
 */
export const WAYBACK_SERVICE_SUB_DOMAINS_DEV = ['waybackdev'];

/**
 * The template of the wayback service root URL.
 */
export const WAYBACK_SERVICE_URL_TEMPLATE =
    'https://{subDomain}.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer';

// const WAYBACK_SERVICE_BASE_PROD =
//     'https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer';
// const WAYBACK_SERVICE_BASE_DEV =
//     'https://waybackdev.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer';

const WAYBACK_CONFIG_FILE_PROD =
    'https://s3-us-west-2.amazonaws.com/config.maptiles.arcgis.com/waybackconfig.json';
const WAYBACK_CONFIG_FILE_DEV =
    'https://s3-us-west-2.amazonaws.com/config.maptiles.arcgis.com/dev/waybackconfig.json';

/**
 * if true, use dev wayback services
 */
let shouldUseDevServices = false;

/**
 *
 * @param defaultOptions
 */
export const setDefaultWaybackOptions = (
    defaultOptions: SetDefaultOptionsParams
) => {
    shouldUseDevServices = defaultOptions.useDevServices || false;
};

const getRandomSubDomain = () => {
    const subDomains = shouldUseDevServices
        ? WAYBACK_SERVICE_SUB_DOMAINS_DEV
        : WAYBACK_SERVICE_SUB_DOMAINS_PROD;

    const randomIdx = Math.floor(Math.random() * subDomains.length);

    const subDomain = subDomains[randomIdx];

    return subDomain;
};

export const getWaybackServiceBaseURL = () => {
    const subDomain = getRandomSubDomain();
    return WAYBACK_SERVICE_URL_TEMPLATE.replace('{subDomain}', subDomain);
};

/**
 * Generates the full URL to retrieve a tile image based on the provided column, row, and zoom level.
 * The function substitutes the placeholders in the URL template with the appropriate values for
 * level, row, and column, and it also replaces the subdomain placeholder with a randomly selected subdomain.
 *
 * @param {GetTileImageURLParams} params - The parameters for generating the tile image URL.
 *     - `urlTemplate`: The template URL containing placeholders for level, row, and column.
 *     - `column`: The column coordinate for the tile.
 *     - `row`: The row coordinate for the tile.
 *     - `level`: The level of detail (zoom level) for the tile.
 * @returns {string} The complete tile image URL with the correct column, row, level, and subdomain.
 */
export const getTileImageURL = ({
    urlTemplate = '',
    column = null,
    row = null,
    level = null,
}: GetTileImageURLParams): string => {
    const subDomain = getRandomSubDomain();

    const url = urlTemplate
        .replace('{level}', level.toString())
        .replace('{row}', row.toString())
        .replace('{col}', column.toString());

    const subDomainToBeReplaced = shouldUseDevServices
        ? 'waybackdev'
        : 'wayback';

    return url.replace(subDomainToBeReplaced, subDomain);
};

export const getWaybackConfigFileURL = () => {
    return shouldUseDevServices
        ? WAYBACK_CONFIG_FILE_DEV
        : WAYBACK_CONFIG_FILE_PROD;
};
