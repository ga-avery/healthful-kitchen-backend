import fetch from 'node-fetch';
import '../utils/shims';
import fs from 'fs/promises';
import router from './books';

/**
 * parameters are a string for the url optionally including url params on the
 * end of the url
 * @param {string} url 
 * @returns {Promise<{}>} json from the api
 */
const apiFetch = async url => {
  const init = {
    "method": "GET",
    "headers": {
      "x-rapidapi-key": process.env.API_KEY,
      "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
    }
  };
  console.log('fetching', url);
  const response = await fetch(url, init);
  const json = await response.json();
  return json;
};

// Main search route (by diet, condition, etc.)
const findRecipe = async (req, res) => {
  console.log('--INSIDE findRecipe---');
  console.log('req.body', req.body);
  let intolerances = req.body.userIntolerance;
  intolerances = intolerances.join('%2C%20');
  console.log(intolerances);
  try {
    let paramString = ['?'];
    paramString.push('intolerances=', intolerances, '&');
    paramString = paramString.join('');
    console.log(paramString);
    const json = await apiFetch('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch' + paramString);
    // console.log(json);
    res.json(json);
  } catch (error) {
    console.log('---ERROR IN findRecipe---');
    console.log(error);

  };
};

const recipeDetail = async (req, res) => {
  console.log(req.body);
  const id = req.body.id;
  try {
    const json = await apiFetch('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/' + id + '/information');
    console.log(json);
    res.json(json);    
  } catch (error) {
    console.log('---ERROR IN recipeDetail---');
    console.log(error);
  }
};

// CREATE

// READ
router.post('/search', findRecipe);
router.get('/:id', recipeDetail);
// UPDATE

// DELETE


export default router;