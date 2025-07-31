import { Col, Row, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { Button, Card, Form, Input } from "antd";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import {
  addSubcategory,
  fetchOneSubcategory,
  updateSubcategory,
} from "redux/features/subcategory";
import { fetchAllCategory } from "redux/features/category";

export const DETAIL_SUBCATEGORY = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();
  const location = useLocation();

  const [categories, setCategories] = useState();

  const onFinish = (values) => {
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
      await dispatch(addSubcategory(values)).unwrap();
      history.push("/app/subcategories");
    } catch (error) {
      message.error(error?.message || "Failed to fetch data");
    }
  };

  const updateData = async (values) => {
    try {
      await dispatch(updateSubcategory(values)).unwrap();
      history.push("/app/subcategories");
    } catch (error) {
      message.error(error?.message || "Failed to fetch data");
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error(errorInfo || "Failed");
  };

  const getDataById = async (id) => {
    try {
      const data = await dispatch(fetchOneSubcategory(id)).unwrap();
      console.log("categoryId", data.data.category_id);
      form.setFieldsValue({
        ...data.data,
        category_id: data.data.category_id,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getCategories = async () => {
    try {
      const response = await dispatch(fetchAllCategory()).unwrap();
      setCategories(
        response.data.map((category) => {
          return {
            value: category.id,
            label: category.name,
          };
        })
      );
    } catch (error) {
      message.error(error?.message || "Failed to fetch data");
    }
  };

  const handleChange = (value) => {
    console.log(value);
  };

  useEffect(() => {
    if (location?.state?.id) {
      getDataById(location?.state?.id);
    }
    getCategories();
  }, []);

  return (
    <>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <h2>Add/Update Subcategory</h2>
          <p>Please fill your data</p>
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
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input your name!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Category"
                name="category_id"
                rules={[
                  {
                    required: true,
                    message: "Please select category!",
                  },
                ]}
              >
                <Select onChange={handleChange} options={categories} />
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

export default DETAIL_SUBCATEGORY;
