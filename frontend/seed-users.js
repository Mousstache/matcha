import { Client } from 'pg';
import faker from 'faker';

const client = new Client({
  user: 'myuser',         // à adapter
  host: 'localhost',
  database: 'appdb',       // à adapter
  password: 'mypassword',     // à adapter
  port: 5432
});

const generateInterests = () => {
  const options = ['sport', 'cinema', 'coding', 'gaming', 'travel', 'music', 'art'];
  return faker.random.arrayElements(options, faker.datatype.number({ min: 1, max: 5 }));
};

const createFakeUser = () => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const userName = faker.internet.userName(firstName, lastName);
  const email = faker.internet.email(firstName, lastName);
  const password = faker.internet.password();
  const gender = faker.name.gender(true);
  const birthDate = faker.date.past(30, new Date(2005, 0, 1));
  const age = new Date().getFullYear() - birthDate.getFullYear();
  const city = faker.address.city();
  const country = faker.address.country();
  const latitude = faker.address.latitude();
  const longitude = faker.address.longitude();

  return {
    email,
    password,
    userName,
    firstName,
    lastName,
    description: faker.lorem.sentences(2),
    preference: faker.random.arrayElement(['male', 'female', 'both']),
    gender,
    birthDate,
    age,
    interests: generateInterests(),
    profile_picture: faker.image.avatar(),
    isOnline: false,
    lastConnection: faker.date.recent(),
    fame_rate: faker.datatype.number({ min: 0, max: 100 }),
    latitude,
    longitude,
    city,
    country,
    emailConfirmed: true
  };
};

const insertUsers = async (count) => {
  await client.connect();

  for (let i = 0; i < count; i++) {
    const user = createFakeUser();

    await client.query(
      `INSERT INTO users 
      (email, password, userName, firstName, lastName, description, preference, gender, birthDate, age, interests, profile_picture, isOnline, lastConnection, fame_rate, latitude, longitude, city, country, emailConfirmed, createdAt, updatedAt)
      VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, NOW(), NOW())`,
      [
        user.email,
        user.password,
        user.userName,
        user.firstName,
        user.lastName,
        user.description,
        user.preference,
        user.gender,
        user.birthDate,
        user.age,
        user.interests,
        user.profile_picture,
        user.isOnline,
        user.lastConnection,
        user.fame_rate,
        user.latitude,
        user.longitude,
        user.city,
        user.country,
        user.emailConfirmed
      ]
    );
  }

  console.log(`${count} utilisateurs insérés avec succès.`);
  await client.end();
};

const numberOfUsers = process.argv[2] || 10;
insertUsers(parseInt(numberOfUsers));