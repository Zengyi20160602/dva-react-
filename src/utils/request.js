import axios from 'axios';

const fetch = (options) => {
  let {
    method = 'get',
    data,
    url,
  } = options
  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: data,
      })
    case 'delete':
      return axios.delete(url, {
        data: data,
      })
    case 'post':
      return axios.post(url, data)
    case 'put':
      return axios.put(url, data)
    case 'patch':
      return axios.patch(url, data)
    default:
      return axios(options)
  }
};

function parseJSON(response) {
  const { statusText, status } = response;
  let data = response.data;
  if (data instanceof Array) {
    data = {
      list: data,
    }
  }
  return Promise.resolve({
    success: true,
    message: statusText,
    statusCode: status,
    ...data,
  });
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error();
  error.message = response.data.message || response.statusText;
  error.status = 'error';
  throw error;
}

function parseErrorMessage(err) {
  const { status, message } = err;
  if (status === 'error') {
    throw new Error(message);
  }
  return { err };
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request( options ) {
  return fetch(options)
    .then(checkStatus)
    .then(parseJSON)
    .catch(parseErrorMessage);
}
