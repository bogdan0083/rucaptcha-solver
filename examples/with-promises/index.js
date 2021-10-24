const Solver = require('rucaptcha-solver');

// create new Solver instance
// If you didn't define your api key 
// then ERROR_KEY_DOES_NOT_EXIST will be thrown
const solver = new Solver({
  apiKey: 'YOUR_API_KEY' // Required
});

// solve captcha
solver.solve('https://upload.wikimedia.org/wikipedia/commons/6/69/Captcha.jpg')
  .then(({id, answer}) => {
    console.log(`Captcha answer is ${answer}`);
    console.log(`Your captcha id is ${id}`);

    // we can get balance from our account if we want
    return solver.getBalance();
  })
  .then(balanceNum => console.log(`Your balance: ${balanceNum}`))

  // handle error
  .catch(e => console.error(e));