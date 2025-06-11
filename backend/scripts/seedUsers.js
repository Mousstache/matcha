// scripts/seedUsers.js
import { faker } from '@faker-js/faker';
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});


const GENDERS = ['Homme', 'Femme', 'Non binaire'];
const PREFERENCES = ['Homme', 'Femme', 'Non binare', 'Les deux'];
const INTERESTS = ['music', 'sport', 'travel', 'literature', 'technology', 'art', 'cooking', 'cinema'];

const generateRandomInterests = () => {
  const shuffled = INTERESTS.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 4) + 1);
};

export async function seedUsersIfEmpty(count = 50) {
  const client = await pool.connect();

  try {
    const { rows } = await client.query('SELECT COUNT(*) FROM users');
    if (parseInt(rows[0].count) > 0) {
      console.log('➡️ Des utilisateurs existent déjà. Aucune insertion.');
      return;
    }

    for (let i = 0; i < count; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const userName = faker.internet.userName({ firstName, lastName });
      const email = faker.internet.email({ firstName, lastName });
      const password = faker.internet.password();
      const description = faker.lorem.paragraph();
      const gender = faker.helpers.arrayElement(GENDERS);
      const preference = faker.helpers.arrayElement(PREFERENCES);
      const birthDate = faker.date.birthdate({ min: 18, max: 40, mode: 'age' });
      const age = new Date().getFullYear() - birthDate.getFullYear();
      const interests = generateRandomInterests();
      const profile_picture = faker.image.avatar();
      // const latitude = faker.location.latitude();
      // const longitude = faker.location.longitude();
      // const city = faker.location.city();
      // const country = faker.location.country();


  const frenchCities = [
    { city: 'Paris', lat: 48.8566, lon: 2.3522 },
    { city: 'Lyon', lat: 45.7640, lon: 4.8357 },
    { city: 'Marseille', lat: 43.2965, lon: 5.3698 },
    { city: 'Toulouse', lat: 43.6047, lon: 1.4442 },
    { city: 'Nice', lat: 43.7102, lon: 7.2620 },
    { city: 'Bordeaux', lat: 44.8378, lon: -0.5792 },
    { city: 'Nantes', lat: 47.2184, lon: -1.5536 },
    { city: 'Strasbourg', lat: 48.5734, lon: 7.7521 },
    { city: 'Montpellier', lat: 43.6117, lon: 3.8777 },
    { city: 'Rennes', lat: 48.1173, lon: -1.6778 }
  ];

  const selectedCity = faker.helpers.arrayElement(frenchCities);
  const city = selectedCity.city;
  const country = "France";
  const latitude = selectedCity.lat + faker.number.float({ min: -0.05, max: 0.05 });
  const longitude = selectedCity.lon + faker.number.float({ min: -0.05, max: 0.05 });


      await client.query(
        `INSERT INTO users
        (email, password, userName, firstName, lastName, description, preference, gender,
         birthDate, age, interests, profile_picture, latitude, longitude, city, country, emailConfirmed)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
        [
          email, password, userName, firstName, lastName, description, preference, gender,
          birthDate, age, interests, profile_picture, latitude, longitude, city, country, true
        ]
      );
    }

    console.log(`✅ ${count} utilisateurs fictifs insérés.`);
  } catch (err) {
    console.error('❌ Erreur lors du seed :', err);
  } finally {
    client.release();
  }
}
