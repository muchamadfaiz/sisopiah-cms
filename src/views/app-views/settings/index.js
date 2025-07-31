import { Col, Row, Select, message } from 'antd';
import React, { useEffect, useState } from "react";
import { Button, Card, Form, Input, InputNumber } from 'antd';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { addUser, fetchOneUser, updateUser } from 'redux/features/user';
import { fetchOneWajib } from 'redux/features/wajib_pajak';
import { getUserProfile } from "redux/features/auth";
import Password from 'antd/lib/input/Password';

export const SETTINGS = () => {

  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();
  const location = useLocation();
  const [company, setCompany] = useState("");
  const [user_id, setUserId] = useState("");

  const [companies, setCompanies] = useState([])
  const [role, setRole] = useState("user")

  const getProfile = async () => {
    try {
      const response = await dispatch(getUserProfile()).unwrap();
      form.setFieldsValue({
        ...response.data.user
      });
      setUserId(response.data.user.id)
      getDataById(response.data.user.id)
      setRole(response.data.user.role_id)
      setCompany(response.data.user.perusahaan)
    } catch (error) {
      message.error(error?.message || "Failed to fetch data");
    }
  };

  const handleChange = (value) => {
    setRole(value)
  };

  const onFinish = (values) => {
    // if (location?.state?.id) {
    //   updateData(values)
    // } else {
    //   createData(values)
    // }
    updateData(values)
  }

  const createData = async (values) => {
    try {
      await dispatch(addUser(values)).unwrap()
      history.push("/app/users")
    } catch (error) {
      message.error(error?.message || 'Failed to register')
    }
  }

  const updateData = async (values) => {
    try {
      await dispatch(updateUser({
        ...values,
        id: user_id, 
        password: values.password && values.confirm_password ? values.password : undefined
      })).unwrap()
      // history.push("/app/users")
      message.success("Data anda berhasil diubah!")
    } catch (error) {
      message.error(error?.message || 'Failed to fetch data')
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const getDataById = async (id) => {
    try {
      const data = await dispatch(fetchOneUser(id)).unwrap()
      form.setFieldsValue({
        ...data.data,
        password: undefined
      });
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getProfile()
  }, [])

  return (
    <>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <h2>Pengaturan</h2>
          <p>Reset password kamu sesuai kebutuhan</p>
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card>
            <Form
              name="basic"
              onFinish={onFinish}
              form={form}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="Username"
                name="username"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Nomor WA"
                name="no_phone"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Kabupaten"
                name="kabupaten"
              >
                <Input disabled />
              </Form.Item>
{/* 
              <Form.Item
                label="OPD"
                name="opd"
              >
                <Input disabled />
              </Form.Item> */}

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Masukkan password anda untuk mengubah data!',
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Confirm Password"
                name="confirm_password"
                rules={[
                  {
                    required: true,
                    message: 'Konfirmasi password anda untuk mengubah data!',
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item

              >
                <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                  Update
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default SETTINGS