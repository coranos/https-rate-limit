'use strict';

const {expect} = require('chai');
const index = require('../../index.js');

const testModuleRef = {};
testModuleRef.request = (options, response) => {
  const retval = '{}';
  const req = {};
  req.headers = {};
  req.statusCode = 200;
  const onFns = {};
  req.on = (fnName, fn) => {
    onFns[fnName] = fn;
  };
  req.write = (body) => {
    // console.log('write', 'onFns', onFns);
    const fn = onFns['data'];
    if (fn) {
      fn(retval);
    }
  };
  req.end = () => {
    // console.log('end', 'onFns', onFns);
    const fn = onFns['end'];
    if (fn) {
      fn();
    }
  };
  response(req);
  return req;
};

describe('index', () => {
  it('sendRequest', async () => {
    index.setUrl('https://localhost');
    index.setUrl('http://localhost');
    index.setModuleRef(testModuleRef);

    const actualModuleRef = index.getModuleRef();
    expect(actualModuleRef).to.equal(testModuleRef);

    try {
      const actualResponse = await index.sendRequest({});
      const expectedResponse = {};
      expect(actualResponse).to.deep.equal(expectedResponse);
    } catch (error) {
      console.trace(error);
    }
  });
});
