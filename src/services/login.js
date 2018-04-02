import request from '../utils/request';
import config from '../utils/config';

const {api: { userLogin }} = config;

export async function login (data) {
    return request({
        url: userLogin,
        method: 'post',
        data,
    });
}