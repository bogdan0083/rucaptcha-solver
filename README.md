# Rucaptcha-solver - rucaptcha client for Node js

Rucaptcha client for small/big captcha with **Promises** and **async/await support**

README in russian is available [here](#asd)

- [Installation](#installation)
- [How to use](#how-to-use)
- [Constructor](#constructor)
- [Available methods](#available-methods)
- [Examples](#examples)
- [Why](#why)

## Installation
> #### rucaptcha-solver requires Node v7.0.0 or greater

##### `npm i rucaptcha-solver`

## How to use
```javascript
// require solver module
const Solver = require('rucaptcha-solver');

// create new Solver instance
const solver = new Solver({
  apiKey: '1abc234de56fab7c89012d34e56fa7b8', // Required
  retryInterval: 3000 // default value. Optional
});

// async/await example. For example with promises check "Examples" link above
(async () => {

  // wikipedia link to captcha
  const captchaUrl = 'https://upload.wikimedia.org/wikipedia/commons/6/69/Captcha.jpg';

  // solve captcha
  const { id, answer } = await solver.solve(captchaUrl);

  console.log(`Your captcha answer is ${answer}`);
  console.log(`Your captcha id is ${id}`);

})();
```
## Constructor
##### `new Solver(settings)`

### Constructor settings
- **apiKey** &lt;String&gt; *required* - Api key from your rucaptcha.com account. Should be length of 32 symbols.

- **retryInterval** &lt;Number&gt; *optional* - retry interval for making request to get captcha in milliseconds. *Default value is 3000 ms*. Number shouldn't be less then 2000 ms, because you have a chance to get banned by rucaptcha server.

### Available methods

`solver.solve(imgPath, options)` - solves captcha image. Image gets downloaded from imgPath.

  - **imgPath** &lt;String&gt; *required* - Path to captcha image. Can be url or local path
  - **params** &lt;Object&gt; *optional* - Additional params with POST request to help solve captcha more easily. All available parameters can be found [here](https://rucaptcha.com/api-rucaptcha#solving_captchas)
  - returns &lt;Promise&gt; which resolves to &lt;Object&gt; with **id** and **answer**

  Here's example with parameters:
  ```javascript
    const Solver = require('rucaptcha-solver');
    const solver = new Solver({ apiKey: 'some-api-key' });

    solver.solve('http://pathtoimage.com/captcha.jpg', {     
      // captcha consists of two or more words
      phrase: 1,
      // captcha uses only latin characters
      language: 2
    })
    // resolves
    .then(({ id, answer }) => console.log(`captcha answer: ${answer}`))
    // handle error
    .catch(error => console.error(error));
  ```
<br>

`solver.getBalance()` - get balance on your account
  - returns &lt;Promise&gt; which resolves to &lt;Number&gt; **balance**

  Example:
  ```javascript
    const Solver = require('rucaptcha-solver');
    const solver = new Solver({ apiKey: 'some-api-key' });

    solver.getBalance()
      .then(balance => console.log(`your balance: ${balance}`))
      // handle error
      .catch(error => console.error(error));
  ```
<br>

`solver.report(captchaId)` - report user if captcha answer is incorrect
  - **captchaId** &lt;Number&gt; *required* - Captcha id. `solve` method return answer to captcha and captchaId
  - returns &lt;Promise&gt; which resolves to &lt;String&gt; 'OK_REPORT_RECORDED'

  Example:
  ```javascript
    const Solver = require('rucaptcha-solver');
    const solver = new Solver({ apiKey: 'some-api-key' });

    // solve captcha first
    solver.solve('http://pathtoimage.com/captcha.jpg')
      .then(({ id, answer }) => {
        // do something with answer...
        // ...
        // if we received incorrect answer, we can report user
        return solver.report(id);
      })
      .then(msg => console.log(msg))
      // handle error
      .catch(error => console.error(error));
  ```

## Examples
### Example with async/await:
```javascript
const Solver = require('rucaptcha-solver');

// create new Solver instance
const solver = new Solver({
  apiKey: 'YOUR_API_KEY',
  retryInterval: 3000
});

(async () => {
  try {
    // get captcha answer
    const { id, answer } = await solver.solve('https://upload.wikimedia.org/wikipedia/commons/6/69/Captcha.jpg');
    console.log(`Captcha answer is ${answer}`);
    console.log(`Your captcha id is ${id}`);

    // we can get balance from our account if we want
    const balanceNum = await solver.getBalance();
    console.log(`our balance is ${balanceNum}`);

    // ...
    // we can report user if we received incorrect captcha answer
    // const success = await solver.report(id);
  } catch (e) {
    // handle error
    console.error(e);
  }
})();
```

### Example with Promises
```javascript
const Solver = require('rucaptcha-solver');

// create new Solver instance
const solver = new Solver({
  apiKey: 'YOUR_API_KEY',
  retryInterval: 3000
});

// solve captcha
solver.solve('https://upload.wikimedia.org/wikipedia/commons/6/69/Captcha.jpg')
  .then((({id, answer}) => {
    console.log(`Captcha answer is ${answer}`);
    console.log(`Your captcha id is ${id}`);
    // we can get balance from our account if we want
    // return solver.getBalance();

    // we can report user if we received incorrect captcha answer
    // return solver.report(id);
  }))
  // if solver.report returned
  // .then(msg => console.log(msg))

  // if solver.getBalance returned
  // .then(balanceNum => console.log(`Your balance: balanceNum`))

  // handle error
  .catch(e => console.error(e));
```
## Why
There are few Rucaptcha clients for node js out there, but some of them are deprecated and don't support promises and async/await. This client solves all the problems.
