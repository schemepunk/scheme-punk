'use strict';


/**
 * Filters a  collection based on the value of an item
 *
 * @param {*} item
 *   The value we are seeking to assert as included or excluded.
 * @param {array<*>} items
 *   An array of values.
 * @param {string} filterBias
 *   Designates whether to return true based on the inclusion or exclusion of
 *     an itemToFilterFor within the passed items. Can be "in" or "out".
 * @returns {boolean}
 *   Returns true if the value meets our filter.
 */
function filterByBias(itemToFilterFor, items, filterBias) {
  if (filterBias !== 'out') {
    // We want to return only the filter items
    return items.indexOf(itemToFilterFor) > -1;
  }
  return items.indexOf(itemToFilterFor) === -1;
}

module.exports = filterByBias;
