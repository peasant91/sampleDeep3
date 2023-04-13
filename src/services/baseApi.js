import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from '../constants/Config';
import Constant from '../constants/Constant';
import StorageKey from '../constants/StorageKey';
import translate from '../locales/translate';

const getClient = axios.create({
    baseURL: Constant[Config.developmentMode].API_URL,
});

getClient.interceptors.request.use(
    async config => {
        const token = await AsyncStorage.getItem(StorageKey.KEY_ACCESS_TOKEN);

        if (token) {
            console.log(`access_token ${token}`);
            config.headers.Authorization = `Bearer ${token}`;
        }
        config.headers.Accept = 'application/json';
        return config;
    },
    err => {
        return Promise.reject(err);
    },
);

getClient.interceptors.response.use(response => {
    console.log(
        `URL:${JSON.stringify(response.config.url, null, 2)}\nResponse:`,
        JSON.stringify(response.data, null, 2),
    );
    return response;
});

// getClient.interceptors.request.use(request => {
//     console.log('Starting Request:', JSON.stringify(request, null, 2))
//     return request
//   })
getClient.interceptors.request.use(x => {
    const printable = `Request: ${x.method.toUpperCase()} \nURL: ${x.baseURL}${
        x.url
    } \nParams: ${JSON.stringify(x.params, null, 2)} \nData: ${JSON.stringify(
        x.data,
        null,
        2,
    )}`;
    console.log(printable);
    return x;
});

export const post = async (route, body, option) => {
    try {
        const response = await getClient.post(route, body);
        return response.data.data;
    } catch (err) {
        console.log('error', JSON.stringify(err));
        getErrorMessage(err);
    }
};

export const patch = async (route, body, option) => {
    try {
        const response = await getClient.patch(route, body);
        return response.data.data;
    } catch (err) {
        getErrorMessage(err);
    }
};

export const get = async (route, body) => {
    try {
        const response = await getClient.get(route, {params: body});
        return response.data.data;
    } catch (err) {
        getErrorMessage(err);
    }
};

export const getRaw = async (route, body) => {
    try {
        const response = await getClient.get(route, {params: body});
        return response.data;
    } catch (err) {
        getErrorMessage(err);
    }
};

const forceSignOut = async () => {
    try {
        await AsyncStorage.clear();
        console.log('masuk gan');
    } catch (error) {
        console.error('Error clearing app data.', error);
    }
};

class APIError {
    status: number;
    title: string;
    message: string;

    constructor(status: number, title: string, message: string) {
        this.status = status;
        this.title = title;
        this.message = message;

        // This is necessary to make the 'instanceof' operator work properly when extending built-in Error class in TypeScript
        Object.setPrototypeOf(this, APIError.prototype);
    }

    // Optional: A method to return the error object as a string, e.g. for logging purposes
    toString(): string {
        return `APIError: { status: ${this.status}, title: "${this.title}", message: "${this.message}" }`;
    }
}


export const getErrorMessage = err => {
    if (err.response) {
        console.log(
            'ERROR RESPONSE:',
            JSON.stringify(err.response.config.url, null, 2),
        );
        console.log('ERROR RESPONSE:', JSON.stringify(err.response.data, null, 2));
        const errorData = err.response.data;
        const errorStatus = errorData?.error?.code
        const errorTitle = errorData.error.title;
        const errorMessage = errorData.error.errors[0].message;
        switch (errorMessage) {
            case 'Unauthenticated':
                throw new APIError(errorStatus, errorTitle, "Data Anda Belum Terdaftar");
            case 'The email has already been taken.':
                throw new APIError(errorStatus, errorTitle, 'Email yang anda gunakan telah terdaftar');
            case 'The phone has already been taken.':
                throw new APIError(errorStatus, errorTitle, 'Nomor Handphone yang anda gunakan telah terdaftar');
            case 'Unauthenticated.':
                forceSignOut();
                throw new APIError(errorStatus, errorTitle, errorMessage ??'Anda Tidak Memiliki Akses, Silahkan Login Ulang');
            case 'Wrong password':
                throw new APIError(errorStatus, errorTitle, 'Kata Sandi Lama Salah. Pastikan Kata Sandi Lama Anda Benar');
            case 'Password anda salah':
                throw new APIError(errorStatus, errorTitle, 'Kata Sandi Anda Salah');
            case '':
                throw new APIError(errorStatus, errorTitle, errorMessage);
            default:
                throw new APIError(errorStatus, errorTitle, errorMessage);
        }
    } else if (err.message === 'Network Error') {
        throw new Error(translate('network_error'));
    } else {
        throw new Error(translate('internal_server_error'));
    }
};
