import axios from "axios";

const BASE_URL = "http://localhost:21260/api/";

export const ENDPOINTS = {
    CLASSES: 'Classes',
    PROFESSORS: 'Professors',
    MODULES: 'Modules'
}

export const createApiEndpoint = endpoint => {

    const url = BASE_URL + endpoint + "/" ;
    return {
        fetchAll: () => axios.get(url),
        fetchById: id => axios.get(url + id),
        create: newRecord => axios.post(url, newRecord),
        update: (id, updatedRecord) => axios.put( url + id, updatedRecord ),
        delete: id => axios.delete(url + id )
    }
}