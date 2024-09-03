type SetDefaultOptionsParams = {
    /**
     * if true, use dev wayback services
     */
    useDevServices?: boolean;
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

export const setDefaultWaybackOptions = (
    defaultOptions: SetDefaultOptionsParams
) => {
    shouldUseDevServices = defaultOptions.useDevServices || false;
};

export const getWaybackServiceBaseURL = () => {
    const subDomains = shouldUseDevServices
        ? WAYBACK_SERVICE_SUB_DOMAINS_DEV
        : WAYBACK_SERVICE_SUB_DOMAINS_PROD;

    const randomIdx = Math.floor(Math.random() * subDomains.length);

    const subDomain = subDomains[randomIdx];

    return WAYBACK_SERVICE_URL_TEMPLATE.replace('{subDomain}', subDomain);
};

export const getWaybackConfigFileURL = () => {
    return shouldUseDevServices
        ? WAYBACK_CONFIG_FILE_DEV
        : WAYBACK_CONFIG_FILE_PROD;
};
