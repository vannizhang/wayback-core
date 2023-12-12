import { extractDateFromWaybackItemTitle } from './waybackItem';

describe('waybackItem helper functions ', () => {
    test('test extractDateFromWaybackItemTitle', () => {
        const output = extractDateFromWaybackItemTitle(
            'World Imagery (Wayback 2014-02-20)'
        );
        expect(output.releaseDateLabel).toBe('2014-02-20');
    });
});
