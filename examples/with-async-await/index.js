// require solver module
const Solver = require('rucaptcha-solver');

// create new Solver instance
// If you didn't define your api key 
// then ERROR_KEY_DOES_NOT_EXIST will be thrown
const solver = new Solver({
  apiKey: 'YOUR_API_KEY' // Required
});

// async/await example. For example with promises check "Examples" link above
(async () => {

  try {
    // wikipedia link to captcha
    const captchaUrl = 'https://upload.wikimedia.org/wikipedia/commons/6/69/Captcha.jpg';

    // solve captcha
    const { id, answer } = await solver.solve(captchaUrl);

    console.log(`Your captcha answer is ${answer}`);
    console.log(`Your captcha id is ${id}`);
  } catch (err) {
    console.log('Oh, no! We got the error!');
    console.log(err.message);
  }

})();