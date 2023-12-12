# wayback-core
The `wayback-core` package offers core functionalities to retrieve all versions of the [World Imagery Wayback archieve](https://www.arcgis.com/home/group.html?id=0f3189e1d1414edfad860b697b7d8311#overview), or find versions that contain local changes.

## Installation 
You can install this package via `npm`. Use the following command:

```sh
npm install @vannizhang/wayback-core
```

## API Documentation

### `getWaybackItems`
Return a list of [`WaybackItem`](#waybackitem) for all World Imagery Wayback releases/versions from the Wayback archive. The output list is sorted by release date in descending order (newest release is the first item).

**Parameters**:

None

**Returns**:
| Type          | Description                                                                                                                                                                        |
|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Promise<[`WaybackItem`](#waybackitem)[]> | When resolved, returns a list of [`WaybackItem`](#waybackitem) sorted by release date in descending order.|

**Example**:
```js
import {
    getWaybackItems,
} from '@vannizhang/wayback-core';

const waybackItems = await getWaybackItems();
```

Here is an example of the response returned by `getWaybackItems()`:
```JS
[
    {
        "itemID":"f5f90c7419f24ceda396088f4e39ae83",
        "itemTitle":"World Imagery (Wayback 2023-12-07)",
        "itemURL":"https://waybackdev.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/56102/{level}/{row}/{col}",
        "metadataLayerUrl":"https://metadatadev.maptiles.arcgis.com/arcgis/rest/services/World_Imagery_Metadata_2023_r11/MapServer",
        "metadataLayerItemID":"be19e857134046638a10dc2886a5398b",
        "layerIdentifier":"WB_2023_R11",
        "releaseNum":56102,
        "releaseDateLabel":"2023-12-07",
        "releaseDatetime": 1701936000000,
    },
    //...
]
```

### `getWaybackItemsWithLocalChanges`
Return a list of [`WaybackItem`](#waybackitem) with local changes for a specified geographic point at a given zoom level.

**Parameters**:
| Parameter | Type                                       | Description                                                                                                                      |
|-----------|--------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| Point     | `{ latitude: number; longitude: number; }` | The geographic coordinates (longitude and latitude) of the location of interest, (e.g., `{longitude: -100.05, latitude: 35.10}`) |
| Zoom      | number                                     | The zoom level used to determine the level of detail for the geographic point                                                    |


**Returns**:
| Type          | Description                                                                                                                                                                        |
|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Promise<[`WaybackItem`](#waybackitem)[]> | When resolved, returns a list of [`WaybackItem`](#waybackitem) with local changes.|

**Example**:
```js
import { 
    getWaybackItemsWithLocalChanges 
} from '@vannizhang/wayback-core';

const waybackItems = await getWaybackItemsWithLocalChanges(
    {
        longitude: 117.1825,
        latitude: 34.0556,
    },
    15
);
```

Here is an example of the response returned by `getWaybackItemsWithLocalChanges()`:
```js
[
    {
        "itemID":"f5f90c7419f24ceda396088f4e39ae83",
        "itemTitle":"World Imagery (Wayback 2023-12-07)",
        "itemURL":"https://waybackdev.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/56102/{level}/{row}/{col}",
        "metadataLayerUrl":"https://metadatadev.maptiles.arcgis.com/arcgis/rest/services/World_Imagery_Metadata_2023_r11/MapServer",
        "metadataLayerItemID":"be19e857134046638a10dc2886a5398b",
        "layerIdentifier":"WB_2023_R11",
        "releaseNum":56102,
        "releaseDateLabel":"2023-12-07",
        "releaseDatetime": 1701936000000,
    },
    //...
]
```

### `getMetadata`
Query the wayback metadata feature service associated with the given wayback release/version to retrieve information (acquisition date, provider, resolution, etc.) of the world imagery wayback tile image at the specified location and zoom level.

**Parameters**:
| Parameter     | Type                                       | Description                                                                                                                      |
|---------------|--------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| Point         | `{ latitude: number; longitude: number; }` | The geographic coordinates (longitude and latitude) of the location of interest, (e.g., `{longitude: -100.05, latitude: 35.10}`) |
| Zoom          | number                                     | The zoom level                                                    |
| releaseNumber | number                                     | The release number of a given wayback release/version. (You can find the release number from the [`WaybackItem`](#waybackitem))                                                                                        |

**Returns**:
| Type          | Description                                                                                                                                                                        |
|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Promise<[`WaybackMetadata`](#waybackmetadata)[]> | When resolved, returns the [`WaybackMetadata`](#waybackmetadata) |

**Example**:
```js
import { getMetadata } from '@vannizhang/wayback-core';

const metadata = await getMetadata(
    {
        longitude: 117.1825,
        latitude: 34.0556,
    },
    15,
    56102,
);
```

Here is an example of the response returned by `getMetadata()`:
```js
{
    "date": 1680307200000, 
    "provider": 'Maxar', 
    "source": 'WV03', 
    "resolution": 0.3, 
    "accuracy": 5
}
```

## Type Definitions

### `WaybackItem`
Object that represents a specific release/version of the World Imagery Wayback archive.

```js
import { WaybackItem } from '@vannizhang/wayback-core';
```

| Name                | Type   | Description                                                                                                                                                                     |                  |
|---------------------|--------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|
| itemID              | string | Id of the ArcGIS Online Item (WMTS Layer) for this World Imagery Wayback release (e.g., `903f0abe9c3b452dafe1ca5b8dd858b9`)                                                    |                  |
| itemTitle           | string | Title of this World Imagery Wayback release (e.g., `World Imagery (Wayback 2014-02-20)`)                                                                                  |                  |
| itemURL             | string | URL template of the WMTS Layer for this Wayback release (e.g., `https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/10/{level}/{row}/{col}`) |                  |
| metadataLayerItemID | string | Id of the ArcGIS Online Item (Feature Layer) for the metadata of this World Imagery Wayback release (e.g., `73b47bbc112b498daf85d40fb972738a`)                             |                  |
| metadataLayerUrl    | string | URL of the metadata Feature Layer (e.g., `https://metadata.maptiles.arcgis.com/arcgis/rest/services/World_Imagery_Metadata_2014_r01/MapServer`)                              |                  |
| layerIdentifier     | string | A unique identifier of this World Imagery Wayback Release (e.g., `WB_2014_R01`)                                                                                          |                  |
| releaseNum          | number | Number of this Wayback release, which is being used as the time parameter in the itemURL: `/MapServer/tile/{releaseNum}/{level}/{row}/{col}`.                                                                        |                  |
| releaseDateLabel    | string | Formatted release date for this Wayback item (e.g.                                        `"2014-02-20"`) |
| releaseDatetime     | number | Release date for this Wayback item as a Unix epoch timestamp (e.g., `1392883200000`)                                                                                        |                  |


### `WaybackMetadata`
This object represents the metadata of a Wayback tile image.

```js
import { WaybackMetadata } from '@vannizhang/wayback-core';
```

| Name       | Type   | Description                           |
|------------|--------|---------------------------------------|
| date       | number | Acquisition date of the image         |
| provider   | string | Provider of the image                 |
| source     | string | Source of the image                   |
| resolution | number | Ground distance that pixels represent |
| accuracy   | number | Number of meters objects are within   |

## Issues 
Find a bug or want to request a new feature? Please let us know by submitting an issue.

## Licensing

### The Imagery

The imagery presented in the Wayback app is subject to the terms and conditions set forth in the Esri Master Agreement or Terms of Use.  See [World Imagery](https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9) for additional details on the imagery content and applicable Terms of Use.

### The Software

Copyright 2023 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [LICENSE](LICENSE) file.
