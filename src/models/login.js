import { login } from '../services/login';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'login',

  state: {},

  effects: {
    * login ({ payload }, { put, call, select }) {
      const data = yield call(login, payload);
      const { locationQuery } = yield select(_ => _.app);
      if (data.success) {
        const { from } = locationQuery;
        yield put({ type: 'app/query' });
        console.log("models login from=" + from);
        if (from && from !== '/login') {
            yield put(routerRedux.push(from))
        } else {
            yield put(routerRedux.push('/dashboard'))
        }
      }
    }
  }
}