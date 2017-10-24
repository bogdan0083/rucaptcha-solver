const path = require('path');
const querystring = require('querystring');
const request = require('request-promise-native');
const fs = require('mz/fs');
const { noop, extend } = require('lodash');
const delay = require('delay');

class Solver {
  constructor(settings) {
    if (!settings || typeof settings !== 'object') {
      throw new Error('No settings found for solver');
    }

    this.apiKey = settings.apiKey;
    this.retryInterval = settings.retryInterval || 3000;

    if (!this.apiKey) {
      throw new Error(`Can't find api key`);
    }

    this.POST_URL = 'http://rucaptcha.com/in.php';
    this.GET_URL = 'http://rucaptcha.com/res.php';
  }

  /**
   * Solve captcha image, defined in imgPath parameter
   *
   * @param  {String} imgPath img path. Can be remote or local img file
   * @param  {Function} cb callback
   * @return {Promise<Object>} resolves to object with captcha id and answer
   * @example
   * const solver = new Solver({ apiKey: 'you-api-key' });
   * const { id, answer } = await solver.solve('https://somewebsite/image.jpg');
   */
  async solve(imgPath, options = {}) {
    try {
      // get buffer of image
      const buffer = await this._fetchImage(imgPath);
      // get base64 string
      const base64Image = await this._imageToBase64(buffer);
      const id = await this._sendImage(base64Image, options);
      const answer = await this._getAnswer(id);
      return { id, answer };
    } catch (e) {
      throw e;
    }
  }

  /**
   * get balance on your rucaptcha account
   * @return {Promise<String>} balance
   */
  async getBalance() {
    try {
      const queryObj = { key: this.apiKey, action: 'getbalance' };

      const balance = await request.get({
        url: this.GET_URL + '?' + querystring.stringify(queryObj)
      });

      return parseFloat(balance);
    } catch (e) {
      throw e;
    }
  }

  async report(captchaId) {
    const queryObj = { key: this.apiKey, action: 'reportbad' };
    return await request.get({
      url: this.GET_URL + '?' + querystring.stringify(queryObj)
    });
  }

  /**
   * send captcha image to rucaptcha server
   * @param  {String}  base64Image base64 representation of image
   * @param  {Object}  options options for captcha to send
   * @return {Promise<Number>} id number of captcha
   */
  async _sendImage(base64Image, options) {
    try {
      // build query
      const queryObj = extend({
        key: this.apiKey,
        method: 'base64',
        json: 1
      }, options);

      // send file
      const url = this.POST_URL + `?${querystring.stringify(queryObj)}`;

      const json = await request.post({
        url: url,
        form: { body : base64Image }
      });

      // parse json
      const response = JSON.parse(json);

      if (response.status === 0) {
        throw new Error(response.request);
      }

      return parseInt(response.request);
    } catch (e) {
      throw e;
    }
  }

  /**
   * get answer of captcha.
   * to get it, we have to send captcha id to GET request
   * @param {Number} captchaId captchaId
   * @return {Promise<String>} Captcha answer
   */
  async _getAnswer(captchaId) {
    try {
      // build query
      const queryObj = {
        key: this.apiKey,
        action: 'get',
        id: captchaId,
        json: 1
      };

      const url = this.GET_URL + `?${querystring.stringify(queryObj)}`;

      const makeRequest = async () => await request.get({ url: url });

      let result;

      while (true) {
        // wait some time
        await delay(this.retryInterval);
        // get json
        const json = await makeRequest();
        // parse json
        const response = JSON.parse(json);

        if (response.status === 1) {
          // captcha solved
          result = response.request;
          break;
        } else if (
          response.request !== 'CAPCHA_NOT_READY' &&
          response.status === 0
        ) {
          // throw if we have error
          // or bad status number
          break;
          throw new Error(response.request);
        }
      }

      return result;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Fetch image from given path
   * path can be local (some file on your hard drive)
   * or remote (from wikipedia, for example)
   * @param  {String} imgPath image path
   * @return {Promise<Buffer>} resolves to the buffer
   */
  async _fetchImage(imgPath) {
    try {
      const remote = /^(http|https)/.test(imgPath);
      if (remote) {
        // remote
        const buf = await request.get({ url: imgPath, encoding: null });
        return buf;
      } else {
        // local
        const buf = await fs.readFile(imgPath);
        return buf;
      }
    } catch (e) {
      throw e;
    }
  }
  /**
   * convert image to base64 string
   * @param  {Buffer} buf image buffer
   * @return {Promise<String>} base64 representation of image
   */
  _imageToBase64(buf) {
    return buf.toString('base64');
  }
}

module.exports = Solver;
