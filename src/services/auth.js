/* export function signIn(userData) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        token: '312jkl312gh315123l123jkh4l214hg1234j234kl134jh1g234',
        user: {
          name: 'galano',
          email: 'guisilva.dev@gmail.com',
        },
      });
    }, 200);
  });
} */

import axios from 'axios';

import * as constants from '../constants/api';

export async function register(data) {
  try {
    let res = await axios.post(constants.REGISTER, data);

    return res.data;
  } catch (e) {
    throw handler(e)
  }
}

export async function login(data) {
  try {
    let res = await axios.post(constants.LOGIN, data);

    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function forgotPassword(data) {
  try {
    let res = await axios.post(constants.FORGOT_PASSWORD, data);

    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function updateProfile(userId, data) {
  try {
    const options = {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data"
      }
    };

    const form_data = new FormData();
    for (let key in data)
      form_data.append(key, data[key]);

    let res = await axios.put(`${constants.UPDATE_PROFILE}/${userId}`, form_data, options);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export function handler(err) {
  let error = err;

  if (err.response && err.response.data.hasOwnProperty("message"))
    error = err.response.data;
  else if (!err.hasOwnProperty("message")) error = err.toJSON();

  return new Error(error.message);
}