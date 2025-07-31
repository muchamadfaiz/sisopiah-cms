import { Col, Row, message } from "antd";
import React, { useEffect, useState } from "react";
import { Button, Card, Form, Input } from "antd";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Select } from "antd";
import {
  addCategory,
  fetchOneCategory,
  updateCategory,
} from "redux/features/category";

export const TARGET = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();
  const location = useLocation();

  const onFinish = (values) => {
    console.log(values);
    if (location?.state?.id) {
      updateData({
        ...values,
        id: location.state.id,
      });
    } else {
      createData(values);
    }
  };

  const createData = async (values) => {
    try {
      await dispatch(addCategory(values)).unwrap();
      history.push("/app/categories");
    } catch (error) {
      message.error(error?.message || "Failed to fetch data");
    }
  };

  const updateData = async (values) => {
    try {
      await dispatch(updateCategory(values)).unwrap();
      history.push("/app/categories");
    } catch (error) {
      message.error(error?.message || "Failed to fetch data");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const getDataById = async (id) => {
    try {
      const data = await dispatch(fetchOneCategory(id)).unwrap();
      console.log(data);
      form.setFieldsValue({
        ...data.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (location?.state?.id) {
      getDataById(location?.state?.id);
    }
  }, []);

  return (
    <>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <h2>Target</h2>
          <p>Static Section</p>
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
                label="Year"
                name="year"
                rules={[
                  {
                    required: true,
                    message: "Please input your Year!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Label1"
                name="label1"
                rules={[
                  {
                    required: true,
                    message: "Please input your Label1",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Label2"
                name="label2"
                rules={[
                  {
                    required: true,
                    message: "Please input your Label2!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Label3"
                name="label3"
                rules={[
                  {
                    required: true,
                    message: "Please input your Label3!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Label4"
                name="label4"
                rules={[
                  {
                    required: true,
                    message: "Please input your Label4!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default TARGET;
