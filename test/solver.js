jest.mock('./__mocks__/request-promise-native');
jest.mock('delay');

const path = require('path');
const Solver = require('../src/solver');

// just an array of fake data (urls)
const validPaths = require('./fixtures/fakeData');

const fakeApiKey = '1abc234de56fab7c89012d34e56fa7b8';

describe('solver', () => {

  let solver;

  beforeAll(() => {
    solver = new Solver({ apiKey: fakeApiKey });
  });

  it('should be instance of Solver', () => {
    expect(solver instanceof Solver).toBeTruthy();
  });

  it('should have API key', () => {
    expect(solver.apiKey).toBeTruthy();
  });

  it('should have API key type of string', () => {
    expect(typeof solver.apiKey === 'string').toBeTruthy();
  });

  it('should have API key length of 32 symbols', () => {
    expect(solver.apiKey.length).toBe(32);
  });

  it('should have post and get urls', () => {
    const solver = new Solver({ apiKey: fakeApiKey });
    expect(solver.POST_URL).toBe('http://rucaptcha.com/in.php');
    expect(solver.GET_URL).toBe('http://rucaptcha.com/res.php');
  });

  it('should throw error if no options are not passed to constructor', () => {
    expect(() => {
      const solver = new Solver();
    }).toThrow();
  });

  it('should throw error if no api key is defined', () => {
    expect(() => {
      const solver = new Solver({});
    }).toThrow();
  });

});

describe('solver.solve', () => {
  let solver;

  beforeAll(() => {
    solver = new Solver({ apiKey: fakeApiKey, retryInterval: 300 });
  });

  it('should solve captcha image successfully', async () => {
    const response1 = await solver.solve(validPaths[0]);
    const response2 = await solver.solve(validPaths[1]);
    expect(response1.answer).toBe('correct');
    expect(response2.answer).toBe('correct');
    expect(response1.id).toBe(28473719);
    expect(response2.id).toBe(28473719);
  });

  it('should throw error', async () => {
    try {
      // not correct image url
      const response = await solver.solve('http://wrongimage.com/image.jpg');
    } catch (e) {
      expect(e.message).toMatch('wrong url');
    }
  });
});
describe('solver.getBalance', () => {
  let solver;

  beforeAll(() => {
    solver = new Solver({ apiKey: fakeApiKey, retryInterval: 300 });
  });

  it('should return fake balance', async () => {
    const balance = await solver.getBalance();
    expect(balance).toBe(34.6);
  });

  it('should have balance typeof number', async () => {
    const balance = await solver.getBalance();
    expect(typeof balance).toBe('number');
  });

});
describe('solver._fetchImage', () => {
  let solver;

  beforeAll(() => {
    solver = new Solver({ apiKey: fakeApiKey });
  });

  it('should return buffer when passed image local path', async () => {
    const buf = await solver._fetchImage(validPaths[0]);
    expect(buf instanceof Buffer).toBeTruthy();
  });

  it('should return buffer when passed image url', async () => {
    const buf = await solver._fetchImage(validPaths[1]);
    expect(buf instanceof Buffer).toBeTruthy();
  });

  it('should return buffer when passed base64', async () => {
    const buf = await solver._fetchImage('aGk=');
    expect(buf instanceof Buffer).toBeTruthy();
  });

  it('should return buffer when passed Buffer object', async () => {
    const buf = await solver._fetchImage(Buffer.from('YnJv', 'base64'));
    expect(buf instanceof Buffer).toBeTruthy();
  });
});

describe('solver._bufferToBase64', () => {

  let solver;

  beforeAll(() => {
    solver = new Solver({ apiKey: fakeApiKey });
  });

  it('should return base64 string from image', async () => {
    const buf = await solver._fetchImage(validPaths[0]);
    const base64 = solver._bufferToBase64(buf);
    expect(typeof base64).toBe('string');
    expect(base64).toMatch(/^.*=$/);
  });

  it('should be rejected', async () => {
    try {
      const buf = await solver._fetchImage(validPaths[0]);
      const base64 = solver._bufferToBase64(buf);
    } catch (e) {
      expect(typeof e).toBe('object');
      expect(e.code).toBe('ENOENT');
    }
  });

});
