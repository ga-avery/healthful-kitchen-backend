import '../utils/shims';
import axios from 'axios';
import express from 'express';
const router = express.Router();

const api_key = process.env.API_KEY;

const simpleSearch = async (req, res) => {

  const { searchQuery } = req.params;
  console.log('---simpleSearch GET---');
  try {
    const searchOptions = {
      method: 'GET',
      url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search',
      params: { searchQuery },
      headers: {
        'x-rapidapi-key': api_key,
        'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
      }
    };
    const searchResult = await axios.request(searchOptions);
    return searchResult.data;

  } catch (error) {
    console.log('[/api/recipes]', error);
    return res.status(400).json({ message: 'Recipe not found' });
  }
};

/* CREATE ROUTES */

/* READ ROUTES */
router.get('/search', simpleSearch);

export default router;