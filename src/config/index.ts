const WAYBACK_SERVICE_BASE_PROD =
    'https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer';
const WAYBACK_SERVICE_BASE_DEV =
    'https://waybackdev.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer';

const WAYBACK_CONFIG_FILE_PROD =
    'https://s3-us-west-2.amazonaws.com/config.maptiles.arcgis.com/waybackconfig.json';
const AYBACK_CONFIG_FILE_DEV =
    'https://s3-us-west-2.amazonaws.com/config.maptiles.arcgis.com/dev/waybackconfig.json';

type TIER = 'production' | 'development';

let tier: TIER = 'production';

export const setTier = (val: TIER) => {
    tier = val;
};

export const getWaybackServiceBaseURL = () => {
    return tier === 'development'
        ? WAYBACK_SERVICE_BASE_DEV
        : WAYBACK_SERVICE_BASE_PROD;
};

export const getWaybackConfigFileURL = () => {
    return tier === 'development'
        ? AYBACK_CONFIG_FILE_DEV
        : WAYBACK_CONFIG_FILE_PROD;
};
