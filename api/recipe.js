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

const findRecipe = async (req, res) => {
  console.log('--INSIDE findRecipe---');
  console.log('req.body', req.body);
  let intolerances = req.body.userIntolerance;
  intolerances = intolerances.join('%2C%20');
  console.log(intolerances);
  try {
    let paramString = ['?'];
    paramString.push('intolerances=', intolerances, '&');
    // for (const key of Object.key(req.body)) {
    //   const value = req.params[key];
    //   paramString.push(`${key}=${value}&`);
    // }
    paramString = paramString.join('');
    console.log(paramString);
    const json = await apiFetch('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch' + paramString);
    console.log(json);
  } catch (error) {
    console.log('---ERROR IN findRecipe---');
    console.log(error);

  };
};

// const complexSearch = async (params) => {
//   console.log(params);
//   let paramString = ['?'];
//   for (const key of Object.keys(params)) {
//     const value = params[key];
//     paramString.push(`${key}=${value}&`);
//   }
//   paramString = paramString.join('');
//   const json = await apiFetch('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch' + paramString);
//   console.log(json);
// };

const findRecipeById = async id => {
  const json = await apiFetch('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/' + id + '/information');
  console.log(json);
  // await fs.writeFile('results.json.new', JSON.stringify(json));
};
//findRecipeById(695486);

// CREATE

// READ
router.post('/search', findRecipe);
router.get('/:id', findRecipeById);
// UPDATE

// DELETE


export default router;