const bcrypt = require('bcrypt');

async function hashValue() {
  const value = 'scotttest';
  const saltRounds = 10;
  const hashedValue = await bcrypt.hash(value, saltRounds);
  console.log('Hashed Value:', hashedValue);
}

hashValue();
