import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Icon } from 'antd';
import styles from './Header.less';
import classNames from 'classnames';

const { Header } = Layout;
const SubMenu = Menu.SubMenu;

const HeaderComp = ({
    user,
    logout,
    switchSider,
    location,
    
    isSiderFold,
}) => {
    let handleUserMenu = e => e.key === 'logout' && logout();

    return (
        <Header className={classNames(
          styles.Header,
    )}>
            <Icon 
            className={styles.toggle}
            type={isSiderFold ? 'menu-unfold' : 'menu-fold'}
            onClick={switchSider} />
            <Menu mode='horizontal' className={styles.userMenu} onClick={handleUserMenu}>
            <SubMenu
            title={<span>
              <Icon type="user" />
              {user.username}
            </span>}
          >
            <Menu.Item key="logout">
              退出
            </Menu.Item>
          </SubMenu>
            </Menu>
        </Header>
    );
}

HeaderComp.propTypes = {
    user: PropTypes.object,
    logout: PropTypes.func,
    switchSider: PropTypes.func,
    location: PropTypes.object,

    isSiderFold: PropTypes.bool,
  }

  export default HeaderComp