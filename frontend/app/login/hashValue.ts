import * as bcrypt from 'bcrypt';


async function hashValue() {
  /* const value = 'UPhD1KnZxU/eKajEG2kPudsPGIWax9zZSsGMpuCVhwo='; */
  const value = 'scotttest';
  const saltRounds = 10; // Adjust the number of salt rounds as needed
  const hashedValue = await bcrypt.hash(value, saltRounds);
  console.log('Hashed Value:', hashedValue);
}

hashValue();