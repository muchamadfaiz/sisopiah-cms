import React from 'react'
import { Card, Row, Col, Form, Input, Button, message } from "antd";
import { MailOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getAuthBackgroundStyle } from 'utils';
import { resetPassword } from 'redux/features/auth';

const ForgotPassword = () => {
	const dispatch = useDispatch()
	const { loading } = useSelector(state => state.auth)
	const [form] = Form.useForm();
	const { authBackground, companyLogo } = useSelector(state => state.theme)

	const onSend = async values => {
		try {
			const response = await dispatch(resetPassword(values.email)).unwrap()
			message.success(response.message)
		} catch(error) {
			message.success(error?.message)
		}
  };

	return (
		<div className="h-100" style={getAuthBackgroundStyle(authBackground)}>
			<div className="container d-flex flex-column justify-content-center h-100">
				<Row justify="center">
					<Col xs={20} sm={20} md={20} lg={9}>
						<Card>
							<div className="my-2">
								<div className="text-center">
									<img style={{ maxHeight: 90, padding: "5px" }} src={companyLogo} alt=""></img>
									<h3 className="mt-3 font-weight-bold">Forgot Password?</h3>
									<p className="mb-4">Enter your Email to reset password</p>
								</div>
								<Row justify="center">
									<Col xs={24} sm={24} md={20} lg={20}>
										<Form form={form} layout="vertical" name="forget-password" onFinish={onSend}>
											<Form.Item 
												name="email" 
												rules={
													[
														{ 
															required: true,
															message: 'Please input your email address'
														},
														{ 
															type: 'email',
															message: 'Please enter a validate email!'
														}
													]
												}>
												<Input placeholder="Email Address" prefix={<MailOutlined className="text-primary" />}/>
											</Form.Item>
											<Form.Item>
												<Button loading={loading} type="primary" htmlType="submit" block>{loading? 'Sending' : 'Send'}</Button>
											</Form.Item>
											<div style={{textAlign:"center"}}>
											<a href="/auth/login" >Go Back to Login Page</a>
											</div>
										</Form>
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

export default ForgotPassword

