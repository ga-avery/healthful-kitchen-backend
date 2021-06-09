import fetch from 'node-fetch';

const apiGet = async (params, init = { "method": "GET", "headers": { "x-rapidapi-key": "0c0f954875msh959e29447b44629p11685fjsn42e6f3e3faae", "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com" } }) => {
  const paramString = ['?'];
  for (const key of Object.keys(params)) {
    const value = params[key];
    paramString.push(`${key}=${value}&`);
  }
  const response = await fetch('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch' +
    paramString.join(''), init);
  const json = await response.json();
  console.log(json);
};

// { keys: value }
apiGet({ maxVitaminB2: 1000, maxCholesterol: 1000, intolerances: 'peanut' });

/* ---CREATE--- */

/* ---READ--- */
router.get('/search', apiGet);

/* ---UPDATE--- */

/* ---DESTROY--- */
