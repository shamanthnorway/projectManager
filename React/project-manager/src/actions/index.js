import axios from 'axios';

export const LOGIN = 'login';
export const SIGN_UP = 'sign_up';
const ROOT_URL = 'http://localhost:3001';

export function login(user, callback) {
    const request = axios.post(`${ROOT_URL}/login`, user)
    .then((response) => callback(response))
    .catch((error) => callback(error));

    return {
        type: LOGIN,
        payload: request
    }
}

export function signup(user, callback) {
    const request = axios.post(`${ROOT_URL}/signup`, user)
    .then((response) => callback(response))
    .catch((error) => callback(error));

    return {
        type: SIGN_UP,
        payload: request
    }
}
