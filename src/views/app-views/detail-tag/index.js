import { Col, Row, message } from 'antd';
import React, { useEffect } from "react";
import { Button, Card, Form, Input } from 'antd';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { addTags, fetchOneTags, updateTags } from 'redux/features/tags';


export const TAG = () => {

  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();
  const location = useLocation()

  const onFinish = (values) => {
    if (location?.state?.id) {
      updateData(values)
    } else {
      createData(values)
    }
  }

  const createData = async (values) => {
    try {
      await dispatch(addTags(values)).unwrap()
      history.push("/app/tags")
    } catch (error) {
      message.error(error?.message || 'Failed to register')
    }
  }

  const updateData = async (values) => {
    try {
      await dispatch(updateTags({ ...values, id: location?.state?.id })).unwrap()
      history.push("/app/tags")
    } catch (error) {
      message.error(error?.message || 'Failed to fetch data')
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const getDataById = async (id) => {
    try {
      const data = await dispatch(fetchOneTags(id)).unwrap()
      console.log(data.data)
      form.setFieldsValue({
        ...data.data
      });
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (location?.state?.id) {
      getDataById(location?.state?.id)
    }
  }, [])

  return (
    <>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <h2>Add/Update Tag</h2>
          <p>Please fill Tag Information</p>
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
            >
              <Form.Item
                label="Tag Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Please input Tag Name',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item>
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

export default TAG