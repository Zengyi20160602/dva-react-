/* global window */
/* global document */
/* global location */
import { menusbase } from '../utils/menus';
import { EnumRoleType } from '../utils/emums';
import { routerRedux } from 'dva/router';
import { query, logout } from '../services/app';
import config from '../utils/config';
import { parse } from 'qs';
import queryString from 'query-string';

const { prefix } = config;

export default {
    namespace: 'app',
    
    state: {
        user: {},
        permissions: {
            visit: [1],
        },
        menu: [
            {
                id: 1,
                icon: 'laptop',
                name: 'Dashboard',
                route: '/dashboard',
            },
        ],
        isSiderFold: window.localStorage.getItem(`${prefix}isSiderFold`) === 'true',
        isDarkTheme: window.localStorage.getItem(`${prefix}isDarkTheme`) === 'true',
        navOpenKeys: JSON.parse(window.localStorage.getItem(`${prefix}navOpenKeys`)) || [],
        locationPathname: '',
        locationQuery: {},
    },
    subscriptions: {
        setupHistory ({ dispatch, history }) {
            history.listen((location) => {
                dispatch({
                    type: 'updateState',
                    payload: {
                        locationPathname: location.pathname,
                        locationQuery: queryString.parse(location.search),
                    },
                })
            })
        },
    },
    effects: {
        /* 用户登录后的二次验证和权限以及进入主界面 */
        * query ({payload}, 
            {call, put, select }) {
                console.log("models app query");
                const { success, user } = yield call(query, payload);
                const { locationPathname } = yield select(_ => _.app);
                if (success && user) {
                    const { permissions } = user;
                    let menu = menusbase;
                    if (permissions.role === EnumRoleType.ADMIN || permissions.role === EnumRoleType.DEVELOPER) {
                        permissions.visit = menusbase.map(item => item.id);
                    }else {
                        permissions.visit = menusbase.map(item => item.id === 2 || item.mpid === 2 || item.id === 3);
                        menu = menusbase.filter((item) => {
                            const cases = [
                                permissions.visit.includes(item.id),
                                item.mpid ? permissions.visit.includes(item.mpid) || item.mpid === '-1' : true,
                                item.bpid ? permissions.visit.includes(item.bpid) : true,
                            ];
                            return cases.every(_ => _);
                        });
                    }
                    yield put ({
                        type: 'updateState',
                        payload: {
                            user,
                            permissions,
                            menu,
                        },
                    })
                    if (window.location.pathname === '/login') {
                        yield put(routerRedux.push({
                            pathname: '/dashboard',
                        }))
                    }else {
                        console.log("console pathname=" + window.location.pathname);
                    }
                }else if (config.enterPage && config.enterPage.indexOf(locationPathname) < 0) {
                    console.log("enterPage to login");
                    yield put(routerRedux.push({
                        pathname: '/login',
                        search: queryString.stringify({
                            from: locationPathname,
                        }),
                    }))
                }
            },
            /* 退出登录 */
        * logout ({ payload }, 
            { call, put }) {
                const data = yield call(logout, parse(payload));
                if (data.success) {
                    yield put({ type: 'query' })
                }
            },
    },
    reducers: {
        updateState (state, { payload }) {
            return {
                ...state,
                ...payload,
            }
        },
        switchSider (state) {
            window.localStorage.setItem(`${prefix}isSiderFold`, !state.isSiderFold);
            return {
                ...state,
                isSiderFold: !state.isSiderFold,
            }
        },
        switchTheme (state) {
            window.localStorage.setItem(`${prefix}isDarkTheme`, !state.isDarkTheme);
            return {
                ...state,
                isDarkTheme: !state.isDarkTheme,
            }
        },
        handleNavOpenKeys (state, { payload: navOpenKeys }) {
            return {
                ...state,
                ...navOpenKeys,
            }
        },
    },
}

