import fetch from 'node-fetch';
import '../utils/shims';
import router from './books';

/**
 * parameters are a string for the url optionally including url params on the
 * end of the url
 * @param {string} url 
 * @returns {Promise<{}>} json from the api
 */

// This builds our headers and sets our API key for the fetch.
const apiFetch = async url => {
  const init = {
    "method": "GET",
    "headers": {
      "x-rapidapi-key": process.env.API_KEY, // To use this app, you will need your own API key, available at RapidAPI.
      "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
    }
  };
  console.log('fetching', url); // This turned out to be a good way to see whether our strings fell together correctly.
  const response = await fetch(url, init);
  const json = await response.json();
  return json;
};

// Main search route (by diet, intolerance, etc.)
const findRecipe = async (req, res) => {
  console.log('--INSIDE findRecipe---'); 
  // This logging was initially in place to see through the weeds when the routes were new, but it stayed relavent throughout testing.
  console.log('req.body ->', req.body);
  // Now we grab the data sent by the frontend team and turn it into something we can use in the API call.
  let intolerances = req.body.userIntolerance;
  let diet = 'diet=' + req.body.userDiet;
  // let condition = req.body.userCondition; // This functionality is a stretch goal.
  
  intolerances = intolerances.join('%2C%20'); // Ugly, but effective for joining more than one intolerance.
  // console.log(intolerances);
  // console.log(diet);
  try {
    let paramString = [];
    paramString.push('intolerances=', intolerances);
    paramString = paramString.join('');
    console.log(paramString);
    // We've hard coded a limit of 12 results during testing. That can be changed by editing line 46 to remove the number= portion.
    const json = await apiFetch('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?number=12&'+ paramString + '&' + diet);
    console.log(json); // Lets us see the json in the console on our side during testing
    res.json(json); // sends the data back to the frontend team.
  } catch (error) {
    console.log('---ERROR IN findRecipe---'); // Labeling everything has been invaluable to me.
    console.log(error);

  };
};

// Display an individual recipe by ID - this has been a sticky bit during development.
const recipeDetail = async (req, res) => {
  console.log('---IN DETAIL ROUTE---');
  console.log(req.body);
  const id = req.body.id;
  try {
    const json = await apiFetch('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/' + id + '/information');
    // This is a direct API call to find recipe by ID. It's still actively in development.
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