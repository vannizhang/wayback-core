import {
    getWaybackConfigData,
    getWaybackItems,
    getWaybackItemByReleaseNumber,
    isValidWaybackItem,
} from './waybackItems';

jest.mock('../config', () => ({
    getWaybackConfigFileURL: jest.fn(() => 'mock-url'),
    customWaybackConfigData: null,
}));
jest.mock('../helpers/waybackItem', () => ({
    extractDateFromWaybackItemTitle: jest.fn((title: string) => {
        // Simulate extracting date from title
        const match = title.match(/\((Wayback )?(\d{4})-(\d{2})-(\d{2})\)/);
        if (!match) return {};
        const [_, __, year, month, day] = match;
        const releaseDatetime = new Date(`${year}-${month}-${day}`).getTime();
        return {
            releaseDateLabel: `${month}/${day}/${year}`,
            releaseDatetime,
        };
    }),
}));

const mockWaybackConfig = {
    '58924': {
        itemID: '925025d364fa4e49958f4f1dd2362beb',
        itemTitle: 'World Imagery (Wayback 2025-09-25)',
        itemURL:
            'https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/58924/{level}/{row}/{col}',
        metadataLayerUrl:
            'https://metadata.maptiles.arcgis.com/arcgis/rest/services/World_Imagery_Metadata_2025_r09/MapServer',
        metadataLayerItemID: '7882c43daf3d4955bed8b5de18bccd82',
        layerIdentifier: 'WB_2025_R09',
    },
    '44988': {
        itemID: 'dec36821b2a6470cb5359babf5be2755',
        itemTitle: 'World Imagery (Wayback 2022-10-12)',
        itemURL:
            'https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/44988/{level}/{row}/{col}',
        metadataLayerUrl:
            'https://metadata.maptiles.arcgis.com/arcgis/rest/services/World_Imagery_Metadata_2022_r13/MapServer',
        metadataLayerItemID: '3ca7cebafaee45c2b01af8ddfa277491',
        layerIdentifier: 'WB_2022_R13',
    },
    '3201': {
        itemID: 'f1d75d38d15240f7aa51b106cd0c9aae',
        itemTitle: 'World Imagery (Wayback 2018-11-07)',
        itemURL:
            'https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/3201/{level}/{row}/{col}',
        metadataLayerUrl:
            'https://metadata.maptiles.arcgis.com/arcgis/rest/services/World_Imagery_Metadata_2018_r15/MapServer',
        metadataLayerItemID: '6f3b3d80c3f14f4388c544393f31b927',
        layerIdentifier: 'WB_2018_R15',
    },
    '23383': {
        itemID: '408d5b24fc4e4650bc7799dd1e1e606f',
        itemTitle: 'World Imagery (Wayback 2014-12-03)',
        itemURL:
            'https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/23383/{level}/{row}/{col}',
        metadataLayerUrl:
            'https://metadata.maptiles.arcgis.com/arcgis/rest/services/World_Imagery_Metadata_2014_r19/MapServer',
        metadataLayerItemID: 'ff7d8be6b25043469feeb7a3b958ef84',
        layerIdentifier: 'WB_2014_R19',
    },
};

beforeEach(() => {
    jest.resetModules();
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockWaybackConfig),
        })
    ) as any;
});

describe('getWaybackConfigData', () => {
    it('fetches and returns wayback config data', async () => {
        const config = await getWaybackConfigData();
        expect(config).toEqual(mockWaybackConfig);
        expect(global.fetch).toHaveBeenCalledWith('mock-url');
    });

    it('returns cached config data on subsequent calls', async () => {
        await getWaybackConfigData();
        (global.fetch as jest.Mock).mockClear();
        const config2 = await getWaybackConfigData();
        expect(config2).toEqual(mockWaybackConfig);
        expect(global.fetch).not.toHaveBeenCalled();
    });
});

describe('isValidWaybackItem', () => {
    it('returns true for valid WaybackItem', () => {
        const valid = isValidWaybackItem(mockWaybackConfig['58924']);
        expect(valid).toBe(true);
    });

    it('returns false for invalid WaybackItem', () => {
        expect(isValidWaybackItem({})).toBe(false);
        expect(isValidWaybackItem(null)).toBe(false);
        expect(isValidWaybackItem({ itemTitle: 123 })).toBe(false);
    });
});

describe('getWaybackItems', () => {
    it('returns sorted array of wayback items with releaseNum and date info', async () => {
        const items = await getWaybackItems();
        expect(Array.isArray(items)).toBe(true);
        expect(items.length).toBe(4);
        // Should be sorted by releaseDatetime descending (newest first)
        expect(items[0].releaseNum).toBe(58924);
        expect(items[1].releaseNum).toBe(44988);
        expect(items[2].releaseNum).toBe(3201);
        expect(items[3].releaseNum).toBe(23383);

        // Should have releaseDateLabel and releaseDatetime
        expect(items[0]).toHaveProperty('releaseDateLabel', '09/25/2025');
        expect(typeof items[0].releaseDatetime).toBe('number');

        expect(items[1]).toHaveProperty('releaseDateLabel', '10/12/2022');
        expect(typeof items[1].releaseDatetime).toBe('number');

        expect(items[2]).toHaveProperty('releaseDateLabel', '11/07/2018');
        expect(typeof items[2].releaseDatetime).toBe('number');
    });
});

describe('getWaybackItemByReleaseNumber', () => {
    it('returns the correct wayback item for a given release number', async () => {
        const item = await getWaybackItemByReleaseNumber(44988);
        expect(item).toBeDefined();
        expect(item?.releaseNum).toBe(44988);
        expect(item?.itemID).toBe('dec36821b2a6470cb5359babf5be2755');
    });

    it('returns undefined for a non-existent release number', async () => {
        const item = await getWaybackItemByReleaseNumber(99999);
        expect(item).toBeUndefined();
    });
});
