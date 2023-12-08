import { getWaybackConfigFileURL } from '../config';
import { extractDateFromWaybackItemTitle } from '../helpers/waybackItem';
import { WaybackConfig, WaybackItem } from '../types';

/**
 * World Imagery Wayback configuration data, encompassing information
 * about all releases. It utilizes the release number as the primary key for retrieval.
 */
let waybackconfig: WaybackConfig = null;

/**
 * An array containing data related to all World Imagery Wayback releases.
 * This array is sorted in descending order based on the release date.
 */
let waybackItems: WaybackItem[] = null;

/**
 * A Map that will be used to efficiently
 * retrieve wayback items by their release numbers.
 */
let waybackItemByReleaseNumber: Map<number, WaybackItem> = null;

/**
 * Get Wayback Configuration file that provides information about all World Imagery Wayback releases.
 * This function retrieves the Wayback Configuration data asynchronously, caching it for subsequent calls.
 * @returns {Promise<WaybackConfig>} A Promise resolving to the Wayback Configuration data.
 */
export const getWaybackConfigData = async (): Promise<WaybackConfig> => {
    // // Check if waybackconfig data is already available; return cached data if present
    if (waybackconfig) {
        return waybackconfig;
    }

    const url = getWaybackConfigFileURL();

    const res = await fetch(url);

    if (!res.ok) {
        throw new Error('failed to fetch wayback config file');
    }

    // Parse the fetched JSON response as WaybackConfig and cache it for subsequent calls
    waybackconfig = (await res.json()) as WaybackConfig;

    return waybackconfig;
};

/**
 * Get an array of data for all World Imagery Wayback releases.
 *
 * This function retrieves an array of Wayback items from the Wayback Configuration data,
 * sorting them by release date in descending order (newset release is the first item) and caching the result for subsequent calls.
 *
 * @returns {Promise<WaybackItem[]>} A Promise resolving to an array of Wayback items.
 */
export const getWaybackItems = async (): Promise<WaybackItem[]> => {
    if (waybackItems) {
        return waybackItems;
    }

    waybackItems = Object.keys(waybackconfig).map((key: string) => {
        const releaseNum: number = +key;

        const waybackconfigItem = waybackconfig[releaseNum];

        if (!waybackconfig[releaseNum]) {
            return null;
        }

        const { itemTitle } = waybackconfigItem;

        // Extract release date details from the Wayback item title using a helper function
        const { releaseDateLabel, releaseDatetime } =
            extractDateFromWaybackItemTitle(itemTitle) || {};

        const waybackItem: WaybackItem = {
            releaseNum,
            releaseDateLabel,
            releaseDatetime,
            ...waybackconfigItem,
        };

        return waybackItem;
    });

    // Remove null entries and sort the Wayback items by releaseDatetime (descending order)
    waybackItems = waybackItems
        .filter((item: WaybackItem | null) => item !== null)
        .sort((a, b) => {
            return b.releaseDatetime - a.releaseDatetime;
        });

    return waybackItems;
};

/**
 * Retrieves a specific World Imagery Wayback item based on the provided release number.
 * It utilizes a Map named waybackItemByReleaseNumber to efficiently
 * retrieve wayback items by their release numbers.
 *
 * @param releaseNumber The release number of the wayback item to retrieve
 * @returns A Promise that resolves with the wayback item corresponding to the provided release number.
 *          If the wayback item for the given release number is not found, it returns undefined.
 */
export const getWaybackItemByReleaseNumber = async (releaseNumber) => {
    if (!waybackItemByReleaseNumber) {
        const waybackItems = await getWaybackItems();

        waybackItemByReleaseNumber = new Map();

        // save wayback items to the `waybackItemByReleaseNumber` map
        for (const waybackItem of waybackItems) {
            waybackItemByReleaseNumber.set(waybackItem.releaseNum, waybackItem);
        }
    }

    return waybackItemByReleaseNumber.get(releaseNumber);
};
