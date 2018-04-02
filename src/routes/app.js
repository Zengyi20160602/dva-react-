import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import config from '../utils/config';
import { Helmet } from 'react-helmet';
import { withRouter } from 'dva/router';
import Error from './error';
import NProgress from 'nprogress';
import pathToRegexp from 'path-to-regexp';
import { LayoutComp, Loader } from '../components';
import { BackTop, Layout } from 'antd';
import classNames from 'classnames';

const { prefix, enterPage } = config;
const { HeaderComp, Bread, FooterComp, SiderComp, styles } = LayoutComp;
const { Content } = Layout;
let lastHref;

const App = ({
    children,
    dispatch,
    app,
    loading,
    location
}) => {
    console.log(loading);
    const { user, isSiderFold, isDarkTheme, navOpenKeys, menu, permissions } = app;
    let { pathname } = location;
    pathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
    console.log("routes app pathname=" + pathname);
    const { logo } = config;
    const current = menu.filter(item => pathToRegexp(item.route || '').exec(pathname));
    const hasPermission = current.length 
                            ? permissions.visit.includes(current[0].id)
                            : false;
    const href = window.location.href;
    if (lastHref !== href) {
        NProgress.start();
        if (!loading.global) {
            NProgress.done();
            lastHref = href;
        }
    }

    const headerProps = {
        user,
        location,
        isSiderFold,
        logout() {
            dispatch({ type: 'app/logout' })
        },
        switchSider() {
            dispatch({ type: 'app/switchSider' })
        },
    };

    const siderProps = {
        menu,
        location,
        isSiderFold,
        isDarkTheme,
        navOpenKeys,
        changeTheme() {
            dispatch({ type: 'app/switchTheme' })
        },
        changeOpenKeys(openKeys) {
            window.localStorage.setItem(`${prefix}navOpenKeys`, JSON.stringify(openKeys))
            dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys }})
        },
    };

    const breadProps = {
        menu,
        location,
    };

    if (enterPage && enterPage.includes(pathname)) {
        console.log("2 enterPage includes pathname");
        return (
            <div>
                <Loader fullScreen spinning={loading.effects['app/query']} />
                {children}
            </div>
        )
    }
    return (
        <div>
            <Loader fullScreen spinning={loading.effects['app/query']}></Loader>
            <Helmet>
                <title>SupCon</title>
                <meta charset="UTF-8" />
                <meta name='viewport' content='width=device-width, initial-scale=1.0' />
                <link rel='icon' href={logo} type='image/x-icon' />
            </Helmet>
            <BackTop />
            <Layout className={classNames(
                styles.layout,
                { [styles.fold]: isSiderFold },
                )}>
                {siderProps.menu.length === 0 ? null : <SiderComp {...siderProps} />}
                <Layout className={styles.mainLayout}>
                    <HeaderComp {...headerProps} />
                    <Content>
                        <Bread {...breadProps} />
                        <div className={styles.mainContent}>
                            {console.log("hasPermission=" + hasPermission)}
                            {hasPermission ? children : <Error />}
                        </div>
                    </Content>
                    <FooterComp />
                </Layout>
            </Layout>
        </div>
    )
}

App.propTypes = {
    children: PropTypes.element.isRequired,
    //location: PropTypes.object,
    //dispatch: PropTypes.func,
    app: PropTypes.object,
    //loading: PropTypes.object,
  }
  
  export default withRouter(connect(({ app, loading }) => ({ app, loading }))(App))
