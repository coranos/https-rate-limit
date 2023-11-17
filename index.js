'use strict';

// libraries

// modules

// constants
const https = require('https');
const http = require('http');

// variables
const callsPerSecondMap = new Map();
let moduleRef;

let url;

let auth;

let timeout = 10000;
// functions

const incrementCallCount = () => {
  const second = Math.floor(Date.now() / 1000);
  // console.log('rate-limit', 'incrementCallCount', 'second', second);
  const minSecond = second - 60;
  // console.log('rate-limit', 'incrementCallCount', 'minSecond', minSecond);
  const deleteSeconds = [];
  callsPerSecondMap.forEach((callCount, mapSecond) => {
    if (mapSecond < minSecond) {
      deleteSeconds.push(mapSecond);
    }
  });
  // console.log('rate-limit', 'incrementCallCount', 'deleteSeconds', deleteSeconds);
  deleteSeconds.forEach((mapSecond) => {
    callsPerSecondMap.delete(mapSecond);
  });
  if (callsPerSecondMap.has(second)) {
    const oldCount = callsPerSecondMap.get(second);
    callsPerSecondMap.set(second, oldCount+1);
  } else {
    callsPerSecondMap.set(second, 1);
  }
  // console.log('rate-limit', 'incrementCallCount', 'callsPerSecondMap', callsPerSecondMap);
};

const delay = (time) => {
  // console.log('rate-limit', 'calling', 'delay');
  incrementCallCount();
  if (!isNaN(time)) {
    if (isFinite(time)) {
      return new Promise((resolve) => {
        const fn = () => {
          // console.log('rate-limit', 'done waiting', 'time', time);
          resolve();
        };
        setTimeout(fn, time);
      });
    }
  }
};

const getHistogram = () => {
  const histogram = [];
  for (const [mapSecond, count] of callsPerSecondMap) {
    const key = new Date(mapSecond*1000)
        .toISOString()
        .replace('T', ' ')
        .replace('.000Z', '');
    histogram.push({
      bucket: key,
      count: count,
    });
  }

  // loggingUtil.log(dateUtil.getDate(), 'histogramMap', histogramMap);
  // loggingUtil.log(dateUtil.getDate(), 'histogram', JSON.stringify(histogram));

  return histogram;
};

/**
 * Sets an authorization string (http 'Authorization' header), useful if node requires api key.
 *
 * @memberof Main
 * @param {string} authString api key as a string
 * @return {undefined} returns nothing.
 */
const setAuth = (authString) => {
  auth = authString;
};

/**
 * sends a request, then waits for an amount of time specified by the rate limit headers sent in the response.
 *
 * @memberof Main
 * @param {any} formData the form data.
 * @return {any} returns any.
 */
const sendRequest = async (formData) => {
  /* istanbul ignore if */
  if (formData == undefined) {
    throw Error(`'formData' is a required parameter.`);
  }
  return new Promise((resolve, reject) => {
    // https://docs.nano.org/commands/rpc-protocol#accounts-balances

    const apiUrl = new URL(url);
    // console.log('apiUrl', apiUrl);
    const body = JSON.stringify(formData);
    // console.log( 'sendRequest request', body );

    const options = {
      method: 'POST',
      hostname: apiUrl.hostname,
      path: apiUrl.pathname,
      port: apiUrl.port,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': body.length,
      },
      timeout: timeout,
    };

    if (!!auth) {
      options.headers['Authorization'] = auth;
    }

    // console.log('url', url);
    // console.log('apiUrl.protocol', apiUrl.protocol);
    const req = moduleRef.request(options, async (res) => {
      // console.log('res.statusCode', res.statusCode);
      if (res.statusCode < 200 || res.statusCode > 299) {
        // console.trace('error', res.statusCode);
        let chunks = '';
        res.on('data', (chunk) => {
          chunks += chunk;
        });

        res.on('end', () => {
          // console.trace('error', res.statusCode);
          reject(Error(JSON.stringify({url: url, formData: formData, body: chunks, statusCode: res.statusCode})));
        });
      } else {
        let chunks = '';
        res.on('data', (chunk) => {
          chunks += chunk;
        });

        res.on('end', async () => {
          // try {
          // console.log('res', res);
          // console.log('statusCode', res.statusCode);
          // console.log('headers', res.headers);
          // const lastLimit = parseInt(res.headers['x-ratelimit-limit'], 10);
          // console.log('headers', 'lastLimit', lastLimit);
          const lastRemaining = parseInt(res.headers['x-ratelimit-remaining'], 10);
          // console.log('headers', 'lastRemaining', lastRemaining);
          const lastReset = parseInt(res.headers['x-ratelimit-reset'], 10);
          // console.log('headers', 'reset', lastReset);
          const time = Math.floor(Date.now() / 1000);
          // console.log('headers', 'timer', time);
          const timeRemaining = lastReset-time;
          // console.log('headers', 'timeRemaining', timeRemaining);
          const pauseTime = Math.floor((timeRemaining*1000.0)/(lastRemaining+1));
          // console.log('headers', 'pauseTime', pauseTime);
          // console.log('headers', 'delay', 'start');
          await delay(pauseTime);
          // console.log('headers', 'delay', 'end');
          // } catch(error) {
          // console.trace(error)
          // }

          if (chunks.length == 0) {
            resolve(undefined);
          } else {
            try {
              const json = JSON.parse(chunks);
              resolve(json);
            } catch (error) {
              reject(error);
            }
          }
        });
      }

      // console.log('headers', 'request', 'return');
    });

    req.on('timeout', () => {
      console.log('timeout abort');
      req.abort();
    });

    req.on('error', (error) => {
      // console.trace('error', error);
      reject(Error(error));
    });

    req.write(body);
    req.end();
  });
};

/**
 * Sets the url to use.
 *
 * @memberof Main
 * @param {string} newUrl url as a string
 * @return {undefined} returns nothing.
 */
const setUrl = (newUrl) => {
  // console.log('started serUrl', newUrl);
  url = newUrl;
  if (url !== undefined) {
    if (url.startsWith('https')) {
      moduleRef = https;
    } else if (url.startsWith('http')) {
      moduleRef = http;
    }
  }
  // console.log('success serUrl', newUrl, url);
};

const getModuleRef = () => {
  return moduleRef;
};

const setModuleRef = (newModuleRef) => {
  moduleRef = newModuleRef;
};

/**
 * Sets the timeout to use.
 *
 * @memberof Main
 * @param {number} newTimeout - the timeout as a number
 * @return {undefined} returns nothing.
 */
const setTimeout = (newTimeout) => {
  timeout = newTimeout;
};

exports.setUrl = setUrl;
exports.setModuleRef = setModuleRef;
exports.getModuleRef = getModuleRef;
exports.sendRequest = sendRequest;
exports.setAuth = setAuth;
exports.getHistogram = getHistogram;
exports.setTimeout = setTimeout;
