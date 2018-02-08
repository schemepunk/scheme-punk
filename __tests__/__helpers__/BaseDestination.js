'use strict';

module.exports = class BaseDestination {
  constructor(options) {
    this.options = options;
  }

  getTarget() {
    return this.target;
  }

  getValue() {
    return this.value;
  }

  getDestination() {
    return this.destination;
  }
}