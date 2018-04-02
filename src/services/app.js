import request from '../utils/request';
import config from '../utils/config';

const { api: {
    user,
    userLogout,
} } = config;
  
export async function logout (params) {
    console.log("services app logout");
    console.log("userLogout=" + userLogout);
    return request({
        url: userLogout,
        method: 'get',
        data: params,
    })
}
  
export async function query (params) {
    return request({
        url: user,
        method: 'get',
        data: params,
    })
}