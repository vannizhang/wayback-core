/**
 * Wayback Configuration file that provides information about all World Imagery Wayback releases.
 *
 * It uses the World Imagery Wayback release number as the key.
 *
 * @example
 * The `2014-02-20` Release of the World Imagery Wayback that has a release number of `10`
 * ```
 * {
 *   10: {
 *     itemID: "903f0abe9c3b452dafe1ca5b8dd858b9",
 *     itemTitle: "World Imagery (Wayback 2014-02-20)",
 *     itemURL: "https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/10/{level}/{row}/{col}",
 *     metadataLayerUrl: "https://metadata.maptiles.arcgis.com/arcgis/rest/services/World_Imagery_Metadata_2014_r01/MapServer",
 *     metadataLayerItemID: "78e801fab4d24ab9a6053c7a461479be",
 *     layerIdentifier: "WB_2014_R01"
 *   },
 *   //...
 * }
 * ```
 */
export type WaybackConfig = {
    [key: number]: {
        /**
         * Id of the ArcGIS Online Item (WMTS Layer) for this World Imagery Wayback release  (e.g., `903f0abe9c3b452dafe1ca5b8dd858b9`)
         */
        itemID: string;
        /**
         * title of this World Imagery Wayback release (e.g. `World Imagery (Wayback 2014-02-20)`)
         */
        itemTitle: string;
        /**
         * URL template for this WMTS Layer (e.g., `https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/10/{level}/{row}/{col}`)
         */
        itemURL: string;
        /**
         * Id of the ArcGIS Online Item (Feature Layer) for the metadata of this World Imagery Wayback release (e.g., `73b47bbc112b498daf85d40fb972738a`)
         */
        metadataLayerItemID: string;
        /**
         * URL of the metatdata Feature Layer (e.g., `https://metadata.maptiles.arcgis.com/arcgis/rest/services/World_Imagery_Metadata_2014_r01/MapServer`)
         */
        metadataLayerUrl: string;
        /**
         * A unique identifier of this World Imagery Wayback Release (e.g., `WB_2014_R01`)
         */
        layerIdentifier?: string;
    };
};

/**
 * This object represents a specific release/version of the World Imagery Wayback service.
 */
export type WaybackItem = {
    /**
     * Id of the ArcGIS Online Item (WMTS Layer) for this World Imagery Wayback release (e.g., `903f0abe9c3b452dafe1ca5b8dd858b9`)
     */
    itemID: string;
    /**
     * title of this World Imagery Wayback release (e.g. `World Imagery (Wayback 2014-02-20)`)
     */
    itemTitle: string;
    /**
     * URL template for this WMTS Layer (e.g., `https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/10/{level}/{row}/{col}`)
     */
    itemURL: string;
    /**
     * Id of the ArcGIS Online Item (Feature Layer) for the metadata of this World Imagery Wayback release (e.g., `73b47bbc112b498daf85d40fb972738a`)
     */
    metadataLayerItemID: string;
    /**
     * URL of the metatdata Feature Layer (e.g., `https://metadata.maptiles.arcgis.com/arcgis/rest/services/World_Imagery_Metadata_2014_r01/MapServer`)
     */
    metadataLayerUrl: string;
    /**
     * A unique identifier of this World Imagery Wayback Release (e.g., `WB_2014_R01`)
     */
    layerIdentifier?: string;
    /**
     * Release number (key used in the `waybackconfig.json`) for this World Imagery Wayback release
     */
    releaseNum: number;
    /**
     * Formated release date for this Wayback item (e.g., `"2014-02-20"`)
     */
    releaseDateLabel: string;
    /**
     * Release date for this Wayback item as unix epoch timestamp (e.g., `1392883200000`)
     */
    releaseDatetime: number;
};

/**
 * This object represents the metadata of a Wayback tile image.
 */
export type WaybackMetadata = {
    /**
     * Acquisition date of the image
     */
    date: number;
    /**
     * Provider of the image
     */
    provider: string;
    /**
     * Source of the image
     */
    source: string;
    /**
     * Indicates the ground distance that the pixels in the source image represent
     */
    resolution: number;
    /**
     * Indicates number of meters that the objects displayed in this image are within
     */
    accuracy: number;
};

export type Point = {
    longitude: number;
    latitude: number;
    x: number;
    y: number;
    spatialReference: {
        wkid: number;
    };
};
