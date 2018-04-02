import React from 'react';
import config from '../../utils/config';
import styles from './Footer.less';
import { Layout } from 'antd';

const { Footer } = Layout;

const FooterComp =() => (
    <Footer className={styles.footer}>
        {config.footerText}
    </Footer>
)

export default FooterComp