import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb, Icon } from 'antd';
import { Link } from 'react-router-dom';
import pathToRegexp from 'path-to-regexp';
import { queryArray } from '../../utils';
import styles from './Bread.less';

const Bread = ({ menu, location }) => {
    /* 匹配当前路由 */
    let current;
    for (let index in menu) {
      if (menu[index].route && pathToRegexp(menu[index].route).exec(location.pathname)) {
        current = menu[index];
        break;
      }
    }

    /* 通过bpid==id 找到id所对应的item,再由此item递归向上找到关联的所有item,最终得到单独路由的完整路径 */
    let pathArray = [];
    const getPathArray = (item) => {
        pathArray.unshift(item);
        if (item.bpid) {
          getPathArray(queryArray(menu, item.bpid, 'id'));
        }
    };

    /* 得到pathArray(单独路由的完整路径)递归树数组，得到paramMap路由最后Key的值 */
    let paramMap = {};
    if (!current) {
        pathArray.push(menu[0] || {
            id: 1,
            icon: 'laptop',
            name: 'Dashboard',
        });
        pathArray.push({
            id: 404,
            name: 'Not Found',
        });
    } else {
        getPathArray(current);

        let keys = [];
        let values = pathToRegexp(current.route, keys).exec(location.pathname.replace('#', ''));
        console.log("bread keys=" + keys.toString);
        if (keys.length) {
            keys.forEach((currentValue, index) => {
                if (typeof currentValue.name !== 'string') {
                    return;
                }
                /* values[index + 1]也许是路由最后的key的具体值,比如user details中单个用户id的具体值value */
                paramMap[currentValue.name] = values[index + 1];
                console.log("values[index + 1] = " + values[index + 1]);
            })
        }
    }

    /* 生成面包屑子项 */
    const breads = pathArray.map((item, key) => {
        const content = (
          <span>{item.icon
            ? <Icon type={item.icon} style={{ marginRight: 4 }} />
            : ''}{item.name}</span>
        );
        return (
          <Breadcrumb.Item key={key}>
            {((pathArray.length - 1) !== key)
              ? <Link to={pathToRegexp.compile(item.route || '')(paramMap) || '#'}>
                {content}
              </Link>
              : content}
          </Breadcrumb.Item>
        );
    })

    return (
        <Breadcrumb className={styles.bread}>
            {breads}
        </Breadcrumb>
    )
}

Bread.propTypes = {
    menu: PropTypes.array,
    location: PropTypes.object,
}

export default Bread