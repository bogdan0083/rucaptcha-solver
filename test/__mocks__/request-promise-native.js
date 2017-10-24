const { noop } = require('lodash');
const validPaths = require('../fixtures/fakeData');
const delay = require('delay');

const postJSON = JSON.stringify({
  status: 1,
  request: 28473719
});

const getJSON = JSON.stringify({
  status: 1,
  request: 'correct'
});

const getJSONErr = JSON.stringify({
  status: 0,
  request: 'CAPCHA_NOT_READY'
});

let retriesCount = 0;

const get = async url => {
  try {
    let urlObj;
    // if first argument is object
    if (typeof url === 'object') {
      urlObj = url;
      url = urlObj.url;
    }

    await delay(50);

    // if have encoding
    if (urlObj && urlObj.encoding === null) {
      const buf = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
      return buf;
    }

    // check if path is correct (if it's in our validPaths array)
    const pathIsValid = validPaths.some(path =>
      path.includes(url.slice(0, 20))
    );

    if (pathIsValid) {
      // if we make request to API to get captcha
      if (url.includes('http://rucaptcha.com/res.php')) {
        // mock getBalance() method
        if (url.includes('getbalance')) {
          return '34.60';
        }
        // mock 'solve' method
        // if retries we made less then 2
        if (retriesCount < 2) {
          retriesCount++;
          return getJSONErr;
        } else {
          // retriesCount = 0;
          return getJSON;
        }
      } else {
        return 'success';
      }
    } else {
      throw new Error('wrong url');
    }
  } catch (e) {
    throw e;
  }
};

const post = async url => {
  let urlObj;
  // if first argument is object
  if (typeof url === 'object') {
    urlObj = url;
    url = urlObj.url;
  }
  await delay(50);
  if (url.includes('http://rucaptcha.com/in.php')) {
    return postJSON;
  } else {
    return 'HAHAHA';
    throw new Error('wrong url');
  }
};

module.exports = { get, post };
