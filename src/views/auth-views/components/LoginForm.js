import { LockOutlined, MailOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react';
import { Alert, Button, Form, Input } from "antd";
import { motion } from "framer-motion";
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
	authenticated, getUserProfile, login, showAuthMessage, showLoading
} from 'redux/features/auth';
import axios from 'axios';
import {strings} from  '../../../res/strings/index'

export const LoginForm = (props) => {
	const dispatch = useDispatch();
	const { loading, message, showMessage } = useSelector(state => state.auth);
	let history = useHistory();
	const { showForgetPassword, extra } = props

	const getUserData = async (token) => {
		try {
			localStorage.setItem('token', token)
			// const response = await dispatch(getUserProfile(token)).unwrap()
			// dispatch(authenticated({ token, user: response.doc }))
			history.push("/app/dashboard/");
		} catch {
			localStorage.removeItem('token')
			history.push("/auth");
		}
	}

	// handleValidSubmit
	const handleValidSubmit = async (values) => {
		try {
			console.log("Submit!")
			dispatch(showLoading())
			const credentials = {
				// email: values.email,
				username: values.username,
				password: values.password
			}
			console.log(credentials)
			const user = await axios.post(`${strings.api.host}/auth/login`, credentials).then(response => {
				// console.log(response)
				return response
			}).catch(function (error) {
				console.log(error);
			});

			console.log(user.data.data.accessToken)

			if (user) {
				const token = user.data.data.accessToken
				if (token) {
					getUserData(token)
				} else {
					dispatch(showAuthMessage(user.data[0].message))
				}
			}else{
				dispatch(showAuthMessage("No User Found!"))
			}

			// const token = user.data.accessToken
			// console.log(user)
			// // if(token){
			// // 	// getUserData(token)
			// // }else{
			// // 	dispatch(showAuthMessage(user.data[0].message))
			// // }
		} catch (err) {
			console.log("Error!")
			dispatch(showAuthMessage(err.message))
		}
	}

	useEffect(() => {
		if (localStorage.getItem('token') !== null) {
			dispatch(showLoading())
			history.push("/app/dashboard/");
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
				<Alert showIcon message={message}></Alert>
			</motion.div>
			<Form
				layout="vertical"
				name="login-form"
				onFinish={handleValidSubmit}
			>
				<Form.Item
					// name="email"
					name="username"
					label="Email"
				>
					<Input prefix={<MailOutlined className="text-primary" />} />
				</Form.Item>
				<Form.Item
					name="password"
					label={
						<div className={`${showForgetPassword ? 'd-flex justify-content-between w-100 align-items-center' : ''}`}>
							<span>Password</span>
							{
								showForgetPassword &&
								<span
									onClick={() => history.push("/auth/forgot-password")}
									className="cursor-pointer font-size-sm font-weight-normal text-muted"
								>
									Lupa Kata Sandi?
								</span>
							}
						</div>
					}
					rules={[
						{
							required: true,
							message: 'Please input your password',
						}
					]}
				>
					<Input.Password prefix={<LockOutlined className="text-primary" />} />
				</Form.Item>
				<Form.Item>
					<Button type="primary" style={{ border: "0px" }} htmlType="submit" block loading={loading}>
						Masuk
					</Button>
				</Form.Item>

				{extra}
			</Form>
			{/* <div>
				<Divider>
					<span className="text-muted font-size-base font-weight-normal">Atau hubungkan dengan</span>
				</Divider>
				<div className="d-flex justify-content-center" style={{ marginBottom: "10px" }}>
					<GoogleLogin style={{ width: "100%" }}
						clientId={"420336364475-8nbt195eek4ja8b6vlb9onv6nu5ma0pr.apps.googleusercontent.com"}
						buttonText="Sign In with your Google Account"
						onSuccess={responseSuccessGoogle}
						onFailure={responseFailureGoogle}
						cookiePolicy={'single_host_origin'}
					></GoogleLogin>
				</div>
			</div> */}
		</>
	)
}

LoginForm.propTypes = {
	otherSignIn: PropTypes.bool,
	showForgetPassword: PropTypes.bool,
	extra: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element
	]),
};

LoginForm.defaultProps = {
	otherSignIn: true,
	showForgetPassword: true
};

export default LoginForm