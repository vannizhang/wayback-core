export const areUint8ArraysEqual = (arr1: Uint8Array, arr2: Uint8Array) => {
    if (arr1.length !== arr2.length) {
        return false;
    }

    // start comparison from the end of the array as the first several hundreds of items in those array
    // will likely be identitical for most of tile images
    for (let i = arr1.length - 1; i >= 0; i--) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }

    return true;
};
