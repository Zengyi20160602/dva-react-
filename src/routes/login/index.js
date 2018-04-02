import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Form, Input, Icon, Button } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

const FormItem = Form.Item;

const Login = ({
    loading,
    dispatch,
    form: {
        getFieldDecorator,
        validateFieldsAndScroll,
    },
}) => {
    console.log(loading);
    function handLogin () {
        validateFieldsAndScroll((errors, values) => {
            if (errors) {
                return
            }
            dispatch({ type: 'login/login', payload: values })
        })
    }
    console.log("routes login");
    return (
        <div className={styles.out}>
            <Row>
                <Col span={6} offset={14}>
                    <form onSubmit={handLogin} layout='vertical'>
                        <FormItem hasFeedback>
                            {
                                getFieldDecorator('username', 
                                    {
                                        rules: [{required: true, message: '请输入用户名', whitespace: true}]
                                    })(
                                        <Input size='large' onPressEnter={handLogin} prefix={<Icon type='user'/>} placeholder='用户名' />)
                            }
                        </FormItem>
                        <FormItem hasFeedback>
                            {
                                getFieldDecorator('password', 
                                    {
                                        rules: [{required: true, message: '请输入密码', whitespace: true}]
                                    })(
                                        <Input size='large' onPressEnter={handLogin} prefix={<Icon type='lock' />} type='password' placeholder='密码' />)
                            }
                        </FormItem>
                        <FormItem>
                            {
                                <Button className={styles.submit} type='primary' size='large' htmlType='submit'>登录</Button>
                            }
                        </FormItem>
                    </form>
                </Col>
            </Row>
        </div>
    )
};
Login.propTypes = {
    form: PropTypes.object,
    dispatch: PropTypes.func,
    loading: PropTypes.object,
};

export default connect(({loading}) => ({loading}))(Form.create()(Login))