import fetch from 'node-fetch';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const axios = require('axios');
require('dotenv').config();
import express from 'express';
const router = express.Router();

const apiGet = async (params, init = { "method": "GET", "headers": { "x-rapidapi-key": "0c0f954875msh959e29447b44629p11685fjsn42e6f3e3faae", "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com" } }) => {
  const paramString = ['?'];
  console.log('---apiGet---');
  console.log(Object);
  for (const key of Object.keys(params)) {
    const value = params[key];
    paramString.push(`${key}=${value}&`);
  }
  const response = await fetch('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch' +
    paramString.join(''), init);
  const json = await response.json();
  console.log(json);
};

const glutenFree = async (params, init = { "method": "GET", "headers": { "x-rapidapi-key": "0c0f954875msh959e29447b44629p11685fjsn42e6f3e3faae", "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com" } }) => {
  const paramString = ['?'];
  for (const key of Object.keys(params)) {
    const value = params[key];
    paramString.push(`${key}=${value}&`);
    console.log(paramString);
  }
  const response = await fetch('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search' +
    paramString.join(''), init);
  const json = await response.json();
  console.log(json);
};

// { keys: value }
//apiGet({ maxVitaminB2: 1000, maxCholesterol: 1000, intolerances: 'peanut' });

/* ---CREATE--- */

/* ---READ--- */
router.get('/search', apiGet);
router.get('/glutenfree', glutenFree);

/* ---UPDATE--- */

/* ---DESTROY--- */

export default router;
