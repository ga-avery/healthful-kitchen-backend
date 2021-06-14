import '../utils/shims';
import express from 'express';
const router = express.Router();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
const JWT_SECRET = process.env.JWT_SECRET;

import { User } from '../models';

/**
 * signup expects a body object (either through json or form-urlencoded) that
 * describes a name, email, and password. using these it creates a unique user
 * and returns that data to the frontend.
 * @param {Request} rq 
 * @param {Response} rs 
 * @returns {*} User definition
 */
const signup = async (rq, rs) => {
  const { name, email, password } = rq.body;
  try {
    // see if a user exists in db by email
    const user = await User.findOne({ email });
    // if user already exists, 400 error and message
    if (user) {
      return rs.status(400).json({ message: 'email already exists' });
    }
    console.log('Create new user');
    const newUser = new User({ name, email, password });
    try {
      await newUser.validate();
    } catch (error) {
      if (error.errors?.password) {
        const err = error.errors.password;
        if (err.kind === 'minlength') {
          return rs.json({ message: 'password too short' });
        }
        return rs.json({ message: `password: ${err.kind}` });
      }
      console.error(error);
      return rs.json({ message: 'unknown validation error' });
    }
    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    newUser.password = hash;
    const savedUser = await newUser.save();
    rs.json(savedUser);
  } catch (error) {
    console.error('[/api/users/signup]', error, '[signup]');
    return rs.status(400).json({ message: 'error occurred, please try again' });
  }
};

/**
 * login expects an email and password
 * @param {Request} rq 
 * @param {Response} rs 
 * @returns {{success: boolean, token: string, userData: string}} javascript
 * object containing a JWT for the current session
 */
const login = async (rq, rs) => {
  const { email, password } = rq.body;

  try {
    // find email
    const user = await User.findOne({ email });

    if (!user) {
      return rs.status(400).json({ message: 'email or password incorrect' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('password correct:', isMatch);

    if (!isMatch) {
      return rs.status(400).json({ message: 'either email or password is incorrect' });
    }

    user.timesLoggedIn++;
    await user.save();
    // create token payload
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      expiredToken: Date.now()
    };
    // inner try-catch for token signing
    try {
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
      console.log('token', token);
      const legit = jwt.verify(token, JWT_SECRET, { expiresIn: '1m' });
      return rs.json({
        success: true,
        token: `Bearer ${token}`,
        userData: legit,
      });
    } catch (error) {
      console.error('[token verify]', error);
      rs.status(400).json({ message: 'session has ended, please log in' });
    }

  } catch (error) {
    console.error('[/api/users/login]', error);
  }
};

/**
 * profile returns information about the current user, excluding the password
 * and other secret backend information.
 * @param {Request} rq 
 * @param {Response} rs 
 * @returns {{
 *  id: string,
 *  name: string,
 *  email: string
 * }}
 */
const profile = async (rq, rs) => {
  console.log('inside of profile route');
  rs.json({
    id: rq.user.id,
    name: rq.user.name,
    email: rq.user.email,

  });
};

/**
 * update accepts a user's id and updated profile information (currently only
 * user's name and user's email) then updates the database with the new
 * information.
 * @param {Request} rq 
 * @param {Response} rs 
 * @returns {{name: string, email: string}}
 */
const update = async (rq, rs) => {
  console.log('---IN UPDATE ROUTE---');
  await User.findByIdAndUpdate(rq.body.id, rq.body, { useFindAndModify: true });
  const user = await User.findOne({ _id: rq.body.id });
  console.log(user);
  rs.json({ name: user.name, email: user.email });
};

/**
 * userDelete deletes a user given its id
 * @param {Request} rq 
 * @param {Response} rs 
 */
const userDelete = async (rq, rs) => {
  console.log('--- in userDelete route ---');
  console.log(rq.body);
  try {
    const user1 = await User.findOne({ _id: rq.body?.id });
    const user = await User.findByIdAndDelete(rq.body.id, { useFindAndModify: true });
    console.log(user1, user);
  } catch (e) {
    console.error('error deleting profile:', rq.body.id);
    console.error('/profile/edit', e);
  }
  rs.json({ message: 'user deleted :)' });
};

/* CREATE */
router.post('/signup', signup);
router.post('/login', login);

/* READ */
router.get('/profile', passport.authenticate('jwt', { session: false }), profile);

/* UPDATE */
router.put('/profile/edit', passport.authenticate('jwt', { session: false }), update);

/* DELETE */
router.delete('/profile/edit', passport.authenticate('jwt', { session: false }), userDelete);




export default router;