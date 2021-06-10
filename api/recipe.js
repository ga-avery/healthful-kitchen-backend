import fetch from 'node-fetch';
import '../utils/shims';
import fs from 'fs/promises';

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
  const response = await fetch(url, init);
  const json = await response.json();
  return json;
};

const complexSearch = async (params) => {
  let paramString = ['?'];
  for (const key of Object.keys(params)) {
    const value = params[key];
    paramString.push(`${key}=${value}&`);
  }
  paramString = paramString.join('');
  const json = await apiFetch('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch' + paramString);
  console.log(json);
};


const findRecipeById = async id => {
  const json = await apiFetch('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/' + id + '/information');
  console.log(json);
  // await fs.writeFile('results.json.new', JSON.stringify(json));
};
findRecipeById(695486);
