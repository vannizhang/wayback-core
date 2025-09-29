/* Copyright 2025 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Converts a longitude value to a tile number at a specified zoom level.
 * @param {number} lon - The longitude value to be converted.
 * @param {number} zoom - The zoom level at which to calculate the tile number.
 * @returns {number} The tile number corresponding to the given longitude and zoom level.
 */
export const long2tile = (lon: number, zoom: number) => {
    return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
};

/**
 * Converts a latitude value to a tile number at a specified zoom level.
 * @param {number} lat - The latitude value to be converted.
 * @param {number} zoom - The zoom level at which to calculate the tile number.
 * @returns {number} The tile number corresponding to the given latitude and zoom level.
 */
export const lat2tile = (lat: number, zoom: number) => {
    return Math.floor(
        ((1 -
            Math.log(
                Math.tan((lat * Math.PI) / 180) +
                    1 / Math.cos((lat * Math.PI) / 180)
            ) /
                Math.PI) /
            2) *
            Math.pow(2, zoom)
    );
};

/**
 * Converts a tile number to the corresponding longitude value at a specified zoom level.
 * @param {number} x - The tile number to be converted.
 * @param {number} z - The zoom level at which the tile number is calculated.
 * @returns {number} The longitude value corresponding to the given tile number and zoom level.
 */
export const tile2Long = (x: number, z: number) => {
    return (x / Math.pow(2, z)) * 360 - 180;
};

/**
 * Converts a tile number to the corresponding latitude value at a specified zoom level.
 * @param {number} y - The tile number to be converted.
 * @param {number} z - The zoom level at which the tile number is calculated.
 * @returns {number} The latitude value corresponding to the given tile number and zoom level.
 */
export const tile2lat = (y: number, z: number) => {
    const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, z);
    return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
};
