'use strict';

// const {expect} = require('chai');
const index = require('../../index.js');

const testModuleRef = {};

describe('index', () => {
  it('sendRequest', async () => {
    index.setModuleRef(testModuleRef);
    index.sendRequest({});
  });
});
