import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { arrayToTree, queryArray } from '../../utils';
import pathToRegexp from 'path-to-regexp';

const Menus = ({ 
    menu, 
    isSiderFold, 
    isDarkTheme, 
    navOpenKeys, 
    changeOpenKeys, 
    location,
}) => {
     /* 生成树状,生成所有树 */
  const menuTree = arrayToTree(menu.filter(_ => _.mpid !== '-1'), 'id', 'mpid');

  /* 递归生成菜单的方法 */
  const levelMap = {};
  const getMenus = (menuTreeN, siderFoldN) => {
    return menuTreeN.map((item) => {
      if (item.children) {

          /* 菜单含有子项，子项还有子项 */
        if (item.mpid) {
          levelMap[item.id] = item.mpid
        }

        return (
          <Menu.SubMenu
            key={item.id}
            title={<span>
              {item.icon && <Icon type={item.icon} />}
              {(!siderFoldN || !menuTree.includes(item)) && item.name}
            </span>}
          >
            {getMenus(item.children, siderFoldN)}
          </Menu.SubMenu>
        )
      }
      return (
        <Menu.Item key={item.id}>
          <Link to={item.route || '#'}>
            {item.icon && <Icon type={item.icon} />}
            {(!siderFoldN || !menuTree.includes(item)) && item.name}
          </Link>
        </Menu.Item>
      )
    })
  };
  /* 生成菜单 */
  const menuItems = getMenus(menuTree, isSiderFold);

  /* 保持选中 */
  const getAncestorKeys = (key) => {
    let map = {}
    const getParent = (index) => {
      const result = [String(levelMap[index])]
      if (levelMap[result[0]]) {
        result.unshift(getParent(result[0])[0])
      }
      return result
    }
    for (let index in levelMap) {
      if ({}.hasOwnProperty.call(levelMap, index)) {
        map[index] = getParent(index)
      }
    }
    return map[key] || []
  }

  /* 当选中菜单项改变时 */
  const onOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.find(key => !navOpenKeys.includes(key));
    const latestCloseKey = navOpenKeys.find(key => !openKeys.includes(key));
    let nextOpenKeys = [];
    if (latestOpenKey) {
      nextOpenKeys = getAncestorKeys(latestOpenKey).concat(latestOpenKey);
    }
    if (latestCloseKey) {
      nextOpenKeys = getAncestorKeys(latestCloseKey);
    }
    changeOpenKeys(nextOpenKeys);
  }

  let menuProps = !isSiderFold ? {
    onOpenChange,
    openKeys: navOpenKeys,
  } : {}

  /* 寻找选中路由 */
  let currentMenu;
  let defaultSelectedKeys;
  for (let item of menu) {
      if (item.route && pathToRegexp(item.route).exec(location.pathname)) {
          currentMenu = item;
          break;
      }
  }

  /* 获取到当前路由下的完整菜单路径组方法 */
  const getPathArray = (array, current, pid, id) => {
    let result = [String(current[id])];
    const getPath = (item) => {
      if (item && item[pid]) {
        result.unshift(String(item[pid]));
        getPath(queryArray(array, item[pid], id));
      }
    }
    getPath(current);
    return result;
  }

  if (currentMenu) {
    defaultSelectedKeys = getPathArray(menu, currentMenu, 'mpid', 'id');
  }

  if (!defaultSelectedKeys) {
    defaultSelectedKeys = ['1'];
  }

  return (
    <Menu
      {...menuProps}
      mode={isSiderFold ? 'vertical' : 'inline'}
      theme={isDarkTheme ? 'dark' : 'light'}
      selectedKeys={defaultSelectedKeys}
    >
      {menuItems}
    </Menu>
  )
}

Menus.propTypes = {
    menu: PropTypes.array,
    isSiderFold: PropTypes.bool,
    isDarkTheme: PropTypes.bool,
    navOpenKeys: PropTypes.array,
    changeOpenKeys: PropTypes.func,
    location: PropTypes.object,
}

export default Menus