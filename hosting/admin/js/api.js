import { getItem } from "./storage.js";
const urls = {
    'session': 'https://us-central1-mahita-2c3b1.cloudfunctions.net/session',
}
const collection = {
    'session': 'sessions'
}

const getAppHeaders = (module) => {
    return { "x-ma-collection": collection[module], 'authorization': 'Bearer ' + getItem('token') }
}

/**
 * api url
 * @param {*} url
 * @returns
 */
const get = async (module) => {
    try {
        const url = urls[module];
        const docs = await fetch(url, {
            headers: getAppHeaders(module),
            method: 'GET',
        });
        return docs.json();
    } catch (error) {
        throw new Error(error);
    }
}

/**
 * api url
 * data is for body
 * @param {*} url
 * @param {*} data
 * @returns
 */
const post = async (data, module) => {
    try {
        const url = urls[module];
        const resp = await fetch(url, {
            headers: getAppHeaders(module),
            method: 'POST',
            body: JSON.stringify(data)
        });
        return resp.json();
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}
/**
 * api url
 * @param {*} url
 * @returns
 */
// both del and put operations urls has to come with id parameter for backend
const del = async (id, module) => {
    try {
        const url = urls[module] + '/' + id;
        const resp = await fetch(url, {
            headers: getAppHeaders(module),
            method: 'DELETE'
        });
        return resp.json();
    } catch (error) {
        throw new Error(error);
    }
}
/**
 * api url
 * data is for body
 * @param {*} url
 * @param {*} data
 * @returns
 */
const put = async (id, data, module) => {
    try {
        const url = urls[module] + '/' + id;
        const resp = await fetch(url, {
            headers: getAppHeaders(module),
            method: 'PUT',
            body: data
        });
        return resp.json();
    } catch (error) {
        throw new Error(error);
    }
}

export {
    get, post, put, del
}