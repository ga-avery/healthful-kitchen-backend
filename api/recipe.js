import fetch from 'node-fetch';
import '../utils/shims';
import fs from 'fs/promises';
console.log(typeof process.env.API_KEY);

const apiGet = async (params, init = {
  "method": "GET",
  "headers": {
    "x-rapidapi-key": process.env.API_KEY,
    "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
  }
}) => {
  let paramString = ['?']; // => ['?']
  for (const key of Object.keys(params)) { // => Object null prototype {intolerances: 'peanut', maxCholesterol: 1500}
    const value = params[key];
    // params = {intolerances: 'peanut'}
    // params.intolerances => 'peanut' 
    // params["intolerances"] => 'peanut'
    paramString.push(`${key}=${value}&`); // ['?', 'intolerances=peanut&', 'maxCholesterol=1500&']
  }
  paramString = paramString.join('');
  const response = await fetch('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch' + paramString, init);
  const json = await response.json();
  console.log(json);
};

// { keys: value }
// apiGet({ maxVitaminB2: 1000, maxCholesterol: 1000, intolerances: 'peanut' });
// apiGet(812966);
const init = {
  "method": "GET",
  "headers": {
    "x-rapidapi-key": process.env.API_KEY,
    "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
  }
};
const findRecipeById = async id => {
  const response = await fetch('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/' + id + '/information', init);
  const json = await response.json();
  console.log(json);
  // await fs.writeFile('results.json.new', JSON.stringify(json));
};
findRecipeById(695486);
