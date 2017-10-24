const delay = ms =>
  new Promise((res, rej) =>
    process.nextTick( () => res() ));

module.exports = delay;
