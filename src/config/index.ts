type SetDefaultOptionsParams = {
    /**
     * if true, use dev wayback services
     */
    useDevServices?: boolean;
};

const WAYBACK_SERVICE_BASE_PROD =
    'https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer';
const WAYBACK_SERVICE_BASE_DEV =
    'https://waybackdev.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer';

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
    return shouldUseDevServices
        ? WAYBACK_SERVICE_BASE_DEV
        : WAYBACK_SERVICE_BASE_PROD;
};

export const getWaybackConfigFileURL = () => {
    return shouldUseDevServices
        ? WAYBACK_CONFIG_FILE_DEV
        : WAYBACK_CONFIG_FILE_PROD;
};
