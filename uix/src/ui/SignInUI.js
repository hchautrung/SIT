import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Form, Input, Button, Checkbox, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { createHash } from 'crypto';

import { signIn } from '../actions/userAction';
import MessageBox from '../components/MessageBox';
import LoadingBox from '../components/LoadingBox';

const { Title } = Typography;

const SignInUI = props => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userInfo, loading, error } = useSelector(state => state.userSignIn);
    const redirect = location.search ? location.search.split('=')[1] : '/';

    const dispatch = useDispatch();

    const onFinish = values => {
        dispatch(signIn(values.username, createHash("sha256").update(values.password).digest("hex")));
    }

    useEffect(()=> {
        if(userInfo) navigate(redirect);
    }, [userInfo, props.history, redirect])

    return (
        <div className = "col" >
             <div className = "row center">
                {loading && <LoadingBox></LoadingBox>}
                {error && <MessageBox variant="danger">{error}</MessageBox>}
            </div>
            <div className = "row center">
                <Card 
                    /*title={<span style={{fontWeight: "bold"}}>Sign in to SIT Community</span>}*/
                    title={<Title style= {{textAlign: "center"}} level={4}>Sign in to SIT Community</Title>}
                    className='card'
                    style={{maxWidth: "480px"}}
                >
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: 'Please input your Username!' }]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your Password!' }]}
                        >
                            <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                            </Form.Item>

                            <a className="login-form-forgot" href="/#">
                            Forgot password
                            </a>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                            </Button>{' '}
                            Or <a href="/#">register now!</a>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default SignInUI;