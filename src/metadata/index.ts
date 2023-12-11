import { Point, WaybackMetadata } from '../types';
import { getWaybackItemByReleaseNumber } from '../wayback-items';
import { METADATA_FIELD_NAMES } from './config';

type MetadataFeature = {
    attributes: {
        [key: string]: any;
    };
};

type MetadataQueryFeaturesResponse = {
    features: MetadataFeature[];
    error?: Error;
};

// can only get metadata when the map is between the min and max zoom level (10 <= mapZoom <= 23)
const MAX_ZOOM = 23;
const MIN_ZOOM = 10;

const { SOURCE_DATE, SOURCE_PROVIDER, SOURCE_NAME, RESOLUTION, ACCURACY } =
    METADATA_FIELD_NAMES;

/**
 * Query the wayback metadata feature service associated with the given wayback release
 * to retrieve information (acquisition date, provider, resolution, etc.) of the world imagery wayback tile
 * at the specified location and zoom level.
 *
 * @param params An object containing parameters for the metadata query:
 * @param point The geometry representing the location to be used in the query.
 * @param zoom The zoom level for the imagery.
 * @param releaseNumber The world imagery wayback release number.
 *
 * @returns A Promise that resolves to `WaybackMetadata`, containing metadata information like date, provider,
 * source, resolution, and accuracy for the specified location and zoom level.
 */
export const getMetadata = async ({
    point,
    zoom,
    releaseNumber,
}: {
    /**
     * point geometry to be used in the query
     */
    point: Point;
    /**
     * zoom level
     */
    zoom: number;
    /**
     * world imagery wayback release number
     */
    releaseNumber: number;
}): Promise<WaybackMetadata> => {
    const queryParams = new URLSearchParams({
        f: 'json',
        where: '1=1',
        outFields: [
            SOURCE_DATE,
            SOURCE_PROVIDER,
            SOURCE_NAME,
            RESOLUTION,
            ACCURACY,
        ].join(','),
        geometry: JSON.stringify(point),
        returnGeometry: 'false',
        geometryType: 'esriGeometryPoint',
        spatialRel: 'esriSpatialRelIntersects',
    });

    // Gets the query URL using the provided release number and zoom level
    const requestURL = await getQueryUrl(releaseNumber, zoom);

    const res = await fetch(`${requestURL}?${queryParams.toString()}`);

    if (!res.ok) {
        throw new Error(
            'failed to query metadata for ' +
                releaseNumber +
                ' release of world imagery wayback'
        );
    }

    const data = (await res.json()) as MetadataQueryFeaturesResponse;

    if (data.error) {
        throw data.error;
    }

    const feature: MetadataFeature =
        data.features && data.features.length ? data.features[0] : null;

    if (!feature) {
        return null;
    }

    const { attributes } = feature;

    const date = attributes[SOURCE_DATE];
    const provider = attributes[SOURCE_PROVIDER];
    const source = attributes[SOURCE_NAME];
    const resolution = attributes[RESOLUTION];
    const accuracy = attributes[ACCURACY];

    return {
        date,
        provider,
        source,
        resolution,
        accuracy,
    } as WaybackMetadata;
};

/**
 * Get the URL that will be used to query the wayback metadata feature service. For each wayback release,
 * there will be a metadata layer created for that release.
 *
 * This function helps to find the Metadata Layer using the input release number and the id of sublayer by zoom number.
 *
 * @param releaseNum The release number of the wayback data.
 * @param zoom The zoom number used to identify the sublayer.
 * @returns URL to be used to do a query of the metadata layer.
 */
const getQueryUrl = async (releaseNum: number, zoom: number) => {
    const waybackItem = await getWaybackItemByReleaseNumber(releaseNum);

    const { metadataLayerUrl } = waybackItem;

    const layerId = getLayerId(zoom);

    return `${metadataLayerUrl}/${layerId}/query`;
};

const getLayerId = (zoom: number) => {
    zoom = zoom + 1;
    const layerID = MAX_ZOOM - zoom;
    // the service has 14 sub layers that provide metadata up to zoom level 10 (layer ID 14), if the zoom level is small that (e.g. 5), there are no metadata
    const layerIdForMinZoom = MAX_ZOOM - MIN_ZOOM;
    return layerID <= layerIdForMinZoom ? layerID : layerIdForMinZoom;
};
