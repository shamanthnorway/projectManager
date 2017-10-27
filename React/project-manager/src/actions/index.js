import axios from 'axios';

export const LOGIN = 'login';
export const USER = 'user';
export const SIGN_UP = 'sign_up';
export const FETCH_TEAMS = 'fetch_teams';
export const FETCH_TEAM = 'fetch_team';
export const FETCH_TASK = 'fetch_task';
export const CREATE_NEW_TASK = 'post_new_task';
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

export function postTask(task, callback) {
    const request = axios.post(`${ROOT_URL}/tasks`, task)
    .then((response) => callback(response))
    .catch((error) => callback(error));

    return {
        type: CREATE_NEW_TASK,
        payload: request
    }
}

export function setUser(user) {
    // console.log('Inside actions: ', user);
    return {
        type: USER,
        payload: user
    }
}

export function fetchTeams(userID, callback) {
    // console.log('In actions',userID);
    // console.log(`GET/ ${ROOT_URL}/${userID}`)
    const request = axios.get(`${ROOT_URL}/${userID}`);
    return {
        type: FETCH_TEAMS,
        payload: request
    }
}

export function fetchTeam(teamID) {
    // console.log('In actions',userID);
    // console.log(`GET/ ${ROOT_URL}/${userID}`)
    const request = axios.get(`${ROOT_URL}/teams/${teamID}`);
    return {
        type: FETCH_TEAM,
        payload: request
    }
}

export function fetchTask(taskID) {
    const request = axios.get(`${ROOT_URL}/tasks/${taskID}`);
    return {
        type: FETCH_TASK,
        payload: request
    }
}