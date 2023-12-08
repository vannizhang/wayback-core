export type WaybackConfig = {
    [key: number]: {
        itemID: string;
        itemTitle: string;
        itemURL: string;
        metadataLayerItemID: string;
        metadataLayerUrl: string;
        itemReleaseName: string;
        layerIdentifier?: string;
    };
};

export type WaybackItem = {
    releaseNum: number;
    releaseDateLabel: string;
    releaseDatetime: number;
    itemReleaseName: string;
    itemID: string;
    itemTitle: string;
    itemURL: string;
    metadataLayerItemID: string;
    metadataLayerUrl: string;
    layerIdentifier?: string;
};

export type WaybackMetadata = {
    date: number;
    provider: string;
    source: string;
    resolution: number;
    accuracy: number;
    releaseDate?: string;
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
