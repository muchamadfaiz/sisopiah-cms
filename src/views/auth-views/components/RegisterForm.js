import React, { useEffect } from 'react'
import { connect, useDispatch } from 'react-redux'
import { LockOutlined, MailOutlined, ProfileOutlined } from '@ant-design/icons';
import { Button, Form, Input, Alert } from "antd";
import { showAuthMessage, showLoading, hideAuthMessage, authenticated, register, sendActivation } from 'redux/features/auth';
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion"
import jwtDecode from 'jwt-decode'

const rules = {
	username: [
		{
			required: true,
			message: 'Please input your email address'
		},
	],
	email: [
		{
			required: true,
			message: 'Please input your email address'
		},
		{
			type: 'email',
			message: 'Please enter a validate email!'
		}
	],
	password: [
		{
			required: true,
			message: 'Please input your password'
		}
	],
	confirm: [
		{
			required: true,
			message: 'Please confirm your password!'
		},
		({ getFieldValue }) => ({
			validator(rule, value) {
				if (!value || getFieldValue('password') === value) {
					return Promise.resolve();
				}
				return Promise.reject('Passwords do not match!');
			},
		})
	]
}

export const RegisterForm = (props) => {
	const dispatch = useDispatch();
	const { showLoading, loading, message, showMessage, showAuthMessage } = props
	const [form] = Form.useForm();
	let history = useHistory();

	const handleValidSubmit = async (values) => {
		showLoading()
		try {
			const response = await dispatch(register({
				username: values.username,
				email: values.email,
				password: values.password
			})).unwrap()
			let data = jwtDecode(response.token)
			dispatch(sendActivation({ id: data.id, email: values.email }))
			window.location.href = "/auth/please"
		} catch(err) {
			console.log('error:', err)
			showAuthMessage("Error, username or email is already taken!")
		}
	}

	useEffect(() => {
		if (localStorage.getItem('token') !== null) {
			history.push("/app")
		}
	});

	return (
		<>
			<motion.div
				initial={{ opacity: 0, marginBottom: 0 }}
				animate={{
					opacity: showMessage ? 1 : 0,
					marginBottom: showMessage ? 20 : 0
				}}>
				<Alert type="error" showIcon message={message}></Alert>
			</motion.div>
			<Form form={form} layout="vertical" name="register-form" onFinish={handleValidSubmit}>
				<Form.Item
					name="username"
					label="Username"
					rules={rules.username}
					hasFeedback
				>
					<Input prefix={<ProfileOutlined className="text-primary" />} />
				</Form.Item>
				<Form.Item
					name="email"
					label="Email"
					rules={rules.email}
					hasFeedback
				>
					<Input prefix={<MailOutlined className="text-primary" />} />
				</Form.Item>
				<Form.Item
					name="password"
					label="Password"
					rules={rules.password}
					hasFeedback
				>
					<Input.Password prefix={<LockOutlined className="text-primary" />} />
				</Form.Item>
				<Form.Item
					name="confirm"
					label="Confirm Password"
					rules={rules.confirm}
					hasFeedback
				>
					<Input.Password prefix={<LockOutlined className="text-primary" />} />
				</Form.Item>
				<Form.Item>
					<Button type="primary" style={{ border: "0px" }} htmlType="submit" block loading={loading}>
						Daftar
					</Button>
				</Form.Item>
			</Form>
		</>
	)
}

const mapStateToProps = ({ auth }) => {
	const { loading, message, showMessage, token, redirect } = auth;
	return { loading, message, showMessage, token, redirect }
}

const mapDispatchToProps = {
	showAuthMessage,
	hideAuthMessage,
	showLoading,
	authenticated
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm)