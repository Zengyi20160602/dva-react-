import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Switch, Layout } from 'antd';
import config from '../../utils/config';
import Menus from './Menu';
import styles from './layout-comp.less';

const { Sider } = Layout;

const SiderComp = ({
    menu,
    isSiderFold,
    isDarkTheme,
    location,
    changeTheme,
    navOpenKeys,
    changeOpenKeys,
}) => {
    const menusProps = {
        menu,
        isSiderFold,
        isDarkTheme,
        location,
        navOpenKeys,
        changeOpenKeys,
    }
    return (
        <Sider 
            style={isDarkTheme ? {color: '#fff'} : {background: "#fff"}}
            collapsible
            collapsed={isSiderFold}>
            <div className={styles.logo}>
                <img alt={'logo'} src={config.logo} />
                {isSiderFold ? '' : <span>{config.name}</span>}
            </div>
            <Menus {...menusProps} />
            {!isSiderFold
                ? <div className={styles.switchtheme}>
                    <span><Icon type="bulb" />切换主题</span>
                    <Switch onChange={changeTheme} defaultChecked={isDarkTheme} checkedChildren="Dark" unCheckedChildren="Light" />
                </div>
                : ''
            }
        </Sider>
    )
}

SiderComp.propTypes = {
    menu: PropTypes.array,
    isSiderFold: PropTypes.bool,
    isDarkTheme: PropTypes.bool,
    location: PropTypes.object,
    changeTheme: PropTypes.func,
    navOpenKeys: PropTypes.array,
    changeOpenKeys: PropTypes.func,
}

export default SiderComp