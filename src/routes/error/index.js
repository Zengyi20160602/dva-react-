import React from 'react';
import { Icon } from 'antd';
import styles from './index.less';

const Error = () => (
    <div>
        <div className={styles.error}>
            <Icon type='frown-o' />
            <h1>404 Not Found</h1>
        </div>
    </div>
)

export default Error