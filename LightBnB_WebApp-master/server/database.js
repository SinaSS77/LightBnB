const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123456',
  host: 'localhost',
  database: 'lightbnb'
});

pool.query(
  `SELECT title FROM properties LIMIT 10;`)
  .then(response => { });


const properties = require('./json/properties.json');                     
const users = require('./json/users.json');

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {

  let queryString = `
  SELECT *
  FROM users
  WHERE email = $1`;

  return pool.query(queryString, [email])
    .then(res => {
      return res.rows[0];
    });
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  let queryString = `
  SELECT *
  FROM users
  WHERE id = $1`;

  return pool.query(queryString, [id])
    .then(userID => {
      return userID.rows[0];
    });
};
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  let params = [user.name, user.password, user.email];
  let queryString = `
  INSERT INTO users(name, password, email)
  VALUES ($1, $2, $3)
  RETURNING *;`;

  return pool.query(queryString, params)
    .then(res => res.rows[0])
    .catch(err => {
      return console.log('querry err:', err);
    });
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  let queryString = `
  SELECT 
         properties.*, 
         reservations.*, 
         avg(rating) as average_rating
  FROM   reservations
  JOIN   properties 
      ON     reservations.property_id = properties.id
  JOIN   property_reviews 
      ON     properties.id = property_reviews.property_id 
  WHERE  reservations.guest_id = $1
      AND    reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;`;
  const values = [guest_id, limit];
  return pool.query(queryString, values)
    .then(res => res.rows)
    .catch(err => { return console.log('query error:', err); });
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  const queryParams = [];

  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as     average_rating
  FROM properties
  LEFT JOIN property_reviews ON properties.id = property_id
  WHERE 1=1
  `;

  //checks for user input of city
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `AND city LIKE $${queryParams.length} `;
  }
  //checks for user input of a specific owner id
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    queryString += `AND owner_id = $${queryParams.length} `;
  }

  if (options.minimum_price_per_night) {
    queryParams.push((options.minimum_price_per_night) * 100);
    queryString += `AND cost_per_night >= $${queryParams.length} `;
  }

  if (options.maximum_price_per_night) {
    queryParams.push((options.maximum_price_per_night) * 100);
    queryString += `AND cost_per_night <= $${queryParams.length} `;
  }

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `AND cost_per_night >= $${queryParams.length} `;
  }
  
  queryParams.push(limit);
  queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;
  // Pay attention: Since queryParams should be an array, we couldnt use object
  console.log(queryString, queryParams);

  return pool.query(queryString, queryParams)
    .then(res => res.rows)
    .catch(err => { return console.log('promise error on getAllProperties:', err); });

};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  let nameArray = [];
  let userInput = [];
  let placeNumberArray = [];
  let counter = 1;
  for (const [key, value] of Object.entries(property)) {
    nameArray.push(key);
    userInput.push(value);
    placeNumberArray.push(`$${counter}`);
    counter++;
  }
  const inputNames = nameArray.join(', ');
  const valuePlaceholder = placeNumberArray.join(', ');

  const queryString = `INSERT INTO properties (${inputNames}) VALUES(${valuePlaceholder})`;
  console.log(queryString);
  return pool.query(queryString, userInput)
    .then(res => res.rows)
    .catch(err => { return console.log('promise error on addProperty:', err); });
};
exports.addProperty = addProperty;
