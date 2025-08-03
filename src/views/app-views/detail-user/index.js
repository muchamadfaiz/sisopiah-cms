import { Col, Row, Select, message, Typography, Divider } from 'antd';
import React, { useEffect, useState } from "react";
import { Button, Card, Form, Input, InputNumber } from 'antd';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { addUser, fetchOneUser, updateUser } from 'redux/features/user';
import { fetchAllWajib } from 'redux/features/wajib_pajak';
import Password from 'antd/lib/input/Password';

const roleOptions = [
  { label: "Admin", value: 1 },
  { label: "Staff", value: 2 },
  { label: "Guru", value: 3 },
  { label: "Siswa", value: 4 },
  { label: "Wali", value: 5 },
];

const statusOptions = [
  { label: "Aktif", value: true },
  { label: "Tidak Aktif", value: false }
];

export const USER = () => {

  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();
  const location = useLocation()

  const [companies, setCompanies] = useState([])
  const [role, setRole] = useState("user")
  const [tipe, setTipe] = useState("user")

  const handleChange = (value) => {
    setRole(value)
  };

  const onFinish = (values) => {
    if (location?.state?.id) {
      updateData(values)
    } else {
      createData(values)
    }
  }

  const role_map = {
    admin: "1",
    perusahaan: "2",
    opd: "3",
    penerima: "4",
    petugas: "5",
    verificator: "6"
  }

  const createData = async (values) => {
    try {
      console.log(values)
      await dispatch(addUser({
        ...values,
        role_id: values.role_id
      })).unwrap()
      history.push("/app/users")
    } catch (error) {
      message.error(error?.message || 'Failed to register')
    }
  }

  const updateData = async (values) => {
    try {
      await dispatch(updateUser({ ...values, role_id: values.role_id, id: location?.state?.id })).unwrap()
      history.push("/app/users")
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
        ...data.data
      });
    } catch (err) {
      console.log(err)
    }
  }

  const getAllCompanies = async () => {
    try {
      const { data } = await dispatch(fetchAllWajib({ limit: 100 })).unwrap();
      const list_pt = data.data.map(item => ({
        value: item.perusahaan,
        label: item.perusahaan
      }));

      setCompanies(list_pt);
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getAllCompanies()
    if (location?.state?.id) {
      getDataById(location?.state?.id)
    }
  }, [])

  const layout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
      md: { span: 6 },
      lg: { span: 5 },
      xl: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
      md: { span: 18 },
      lg: { span: 19 },
      xl: { span: 20 },
    },
  };

  return (
    <>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <h2>Tambah/Update Data Pengguna</h2>
          <p>Tolong isikan data sesuai dengan data pengguna</p>
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card>
            <Form
              name="basic"
              form={form}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              labelAlign="right"
              {...layout}
            >
            <Typography.Title level={5}>Profil Pengguna</Typography.Title>

              <Form.Item
                label="Username"
                name="username"
                rules={[
                  {
                    required: true,
                    message: 'Please input your username!',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Please input your email!',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="No HP"
                name="no_phone"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Role"
                name="role_id"
                rules={[{ required: true, message: 'Please select a role!' }]}
                >
                <Select placeholder="Pilih Role" options={roleOptions} />
              </Form.Item>

               <Divider />
              <Form.Item>
                <Typography.Title level={5}>Keamanan Pengguna</Typography.Title>
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
              >
                <Password />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="confirm_password"
                dependencies={["password"]}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Konfirmasi password tidak cocok!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Status"
                name="is_active"
                rules={[{ required: true, message: 'Please select a status!' }]}
                >
                <Select placeholder="Pilih Status" options={statusOptions} />
              </Form.Item>


              <Form.Item wrapperCol={24}>
                <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default USER