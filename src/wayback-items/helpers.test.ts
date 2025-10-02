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

import { extractDateFromWaybackItemTitle } from './helpers';

describe('extractDateFromWaybackItemTitle', () => {
    it('should extract date and timestamp from a valid title', () => {
        const result = extractDateFromWaybackItemTitle(
            'World Imagery (Wayback 2014-02-20)'
        );
        expect(result.releaseDateLabel).toBe('2014-02-20');
        expect(result.releaseDatetime).toBe(new Date(2014, 1, 20).getTime());
    });

    it('should return empty label and 0 timestamp for empty input', () => {
        const result = extractDateFromWaybackItemTitle('');
        expect(result.releaseDateLabel).toBe('');
        expect(result.releaseDatetime).toBe(0);
    });

    it('should return original string as label and 0 timestamp if no date is found', () => {
        const result = extractDateFromWaybackItemTitle('No date here');
        expect(result.releaseDateLabel).toBe('');
        expect(result.releaseDatetime).toBe(0);
    });

    it('should extract the first date if multiple dates are present', () => {
        const result = extractDateFromWaybackItemTitle(
            'First 2010-01-01 and Second 2020-12-31'
        );
        expect(result.releaseDateLabel).toBe('2010-01-01');
        expect(result.releaseDatetime).toBe(new Date(2010, 0, 1).getTime());
    });

    it('should handle malformed date gracefully', () => {
        const result = extractDateFromWaybackItemTitle(
            'World Imagery (Wayback 2014-02)'
        );
        expect(result.releaseDateLabel).toBe('');
        expect(result.releaseDatetime).toBe(0);
    });

    it('should handle titles with only a date', () => {
        const result = extractDateFromWaybackItemTitle('2018-07-15');
        expect(result.releaseDateLabel).toBe('2018-07-15');
        expect(result.releaseDatetime).toBe(new Date(2018, 6, 15).getTime());
    });
});
