import React from 'react'
import { Card, Row, Col } from "antd";
import { Button, Form, Input, message } from "antd";
import { MailOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getAuthBackgroundStyle } from 'utils';
import { resendActivation } from 'redux/features/auth';

const Resend = props => {
    const dispatch = useDispatch()
    const { authBackground, companyLogo } = useSelector(state => state.theme)

    const onFinish = async (values) => {
        try {
            await dispatch(resendActivation(values.email)).unwrap()
            message.success("Activation link successfully resend!")
        } catch {
            message.error("Activation link can not be resend!")
        }
    }

    return (
        <div className="h-100" style={getAuthBackgroundStyle(authBackground)}>
            <div className="container d-flex flex-column justify-content-center h-100">
                <Row justify="center">
                    <Col xs={20} sm={20} md={20} lg={7}>
                        <Card>
                            <div className="my-2">
                                <div className="text-center">
									<img style={{ maxHeight: 90, padding: "5px" }} src={companyLogo} alt=""></img>
                                    <p className="text-center">Resend Activation Link!</p>
                                </div>
                                <Row justify="center">
                                    <Col xs={24} sm={24} md={20} lg={20}>
                                        <Form onFinish={onFinish}>
                                            <Form.Item
                                                name="email"
                                                label="Email"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please input your email',
                                                    },
                                                    {
                                                        type: 'email',
                                                        message: 'Please enter a validate email!'
                                                    }
                                                ]}>
                                                <Input prefix={<MailOutlined className="text-primary" />} />
                                            </Form.Item>
                                            <Button htmlType="submit" type="primary" style={{width:"100%"}}>Send</Button>
                                        </Form>
                                        <br/>
                                        <p style={{textAlign:"center"}}>Go back to <a href="/auth/login">Login Page</a></p>
                                    </Col>
                                </Row>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default Resend