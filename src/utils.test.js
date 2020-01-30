const { chunk } = require('./utils');

test('[1, 2, 3, 4] chunked with size 2 results in [[1, 2], [3, 4]]', () => {
    expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
});

test('[1, 2, 3, 4, 5] chunked with size 2 results in [[1, 2], [3, 4], [5]]', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
});
