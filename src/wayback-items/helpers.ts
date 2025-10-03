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
 * This function converts a date string in the format of "YYYY-MM-DD" to a timestamp.
 * If the input string is invalid or not in the expected format, it returns 0.
 * @param dateString a date string in the format of "YYYY-MM-DD"
 * @returns
 */
const convertDateFromWaybackItemTitle = (dateString = ''): number => {
    if (!dateString) {
        return 0;
    }

    const dateParts = dateString.split('-').filter((part) => part !== '');

    if (dateParts.length !== 3) {
        return 0;
    }

    const year = +dateParts[0];
    const mon = +dateParts[1] - 1;
    const day = +dateParts[2];
    return new Date(year, mon, day).getTime();
};

// the title of wayback item is like "World Imagery (Wayback 2014-02-20)",
// therefore need to call this method to extract "2014-02-20" from string
export const extractDateFromWaybackItemTitle = (waybackItemTitle = '') => {
    if (!waybackItemTitle || waybackItemTitle.trim() === '') {
        return {
            releaseDateLabel: '',
            releaseDatetime: 0,
        };
    }

    const regexpYYYYMMDD = /\d{4}-\d{2}-\d{2}/g;
    const matched = waybackItemTitle.match(regexpYYYYMMDD);

    if (!matched || matched.length === 0) {
        return {
            releaseDateLabel: '',
            releaseDatetime: 0,
        };
    }

    const dateString = matched[0];

    const releaseDatetime = convertDateFromWaybackItemTitle(dateString);

    return {
        releaseDateLabel: dateString,
        releaseDatetime,
    };
};
