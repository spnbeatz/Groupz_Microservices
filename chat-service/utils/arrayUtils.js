function areArraysEqual(arr1, arr2) {
    return arr1.length === arr2.length &&
           new Set(arr1).size === new Set(arr2).size &&
           [...new Set(arr1)].every(item => arr2.includes(item));
}

module.exports = { areArraysEqual }