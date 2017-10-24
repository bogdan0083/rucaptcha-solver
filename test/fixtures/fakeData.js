const path = require('path');

const validPaths = [
  path.join(__dirname, './images', 'Captcha.jpg'),
  'http://validurl.com/image.jpg',
  'http://rucaptcha.com/in.php',
  'http://rucaptcha.com/res.php'
];

module.exports = validPaths;
