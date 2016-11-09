'use strict';

module.exports = class schemePunkDestination {
  constructor(options){
    this.destination = options.destination;
  }

  getDestination() {
    return this.destination;
  }
}
