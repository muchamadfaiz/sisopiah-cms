import { Col, DatePicker, Row, Tabs, message } from "antd";
import React, { useEffect, useState } from "react";
import { Button, Card, Form, Input } from "antd";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Select } from "antd";
import {
  addWajib,
  fetchOneWajib,
  updateWajib,
} from "redux/features/wajib_pajak";
import { MyEditor } from "../../../components/Editor";
import { fetchAllCategory } from "redux/features/category";
import ImageUploader from "components/shared-components/ImageUploader";
import { fetchAllSubcategory } from "redux/features/subcategory";
import { fetchAllTags } from "redux/features/tags";
import moment from "moment";

const selectStyle = {
  width: "100%",
  backgroundColor: "white",
};

const rules = [
  {
    required: true,
    message: "Wajib Diisi!",
  },
];

export const ADD_INSTANSI = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();
  const location = useLocation();

  const [idBody, setIdBody] = useState("");
  const [enBody, setEnBody] = useState("");
  const [subcategories, setSubcategories] = useState();
  const [tags, setTags] = useState();
  const [imgUrl, setImgUrl] = useState("");

  const onFinish = (values) => {
    if (location?.state?.id) {
      updateData(values);
    } else {
      createData(values);
    }
  };

  const createData = async (values) => {
    console.log("create data :", values);
    try {
      await dispatch(
        addWajib({
          ...values,
          actual:parseInt(values.actual),
          target:parseInt(values.target),
          year:parseInt(values.year)
        })
      ).unwrap();
      history.push("/app/wajib-pajak");
    } catch (error) {
      message.error(error?.message || "Failed to fetch data");
    }
  };

  const updateData = async (values) => {
    try {
      await dispatch(
        updateWajib({
          ...values,
          id:location?.state?.id,
          actual:parseInt(values.actual),
          target:parseInt(values.target),
          year:parseInt(values.year)
        })
      ).unwrap();
      history.push("/app/wajib-pajak");
    } catch (error) {
      message.error(error?.message || "Failed to fetch data");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const getDataById = async (id) => {
    try {
      const data = await dispatch(fetchOneWajib(id)).unwrap();
      form.setFieldsValue({
        ...data.data,
        category: data.data.category_id
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getSubcategories = async () => {
    try {
      const response = await dispatch(fetchAllSubcategory()).unwrap();
      setSubcategories(
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

  const getTags = async () => {
    try {
      const response = await dispatch(fetchAllTags()).unwrap();
      setTags(
        response.data.map((tag) => {
          return {
            value: tag.id,
            label: tag.name,
          };
        })
      );
    } catch (error) {
      message.error(error?.message || "Failed to fetch data");
    }
  };

  const handleImageUpload = (info) => {
    if (info.file.status === "uploading") {
      // setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      setImgUrl(info.file.response.secure_url);
    }
  };

  useEffect(() => {
    if (location?.state?.id) {
      getDataById(location?.state?.id);
    }
    getSubcategories();
    getTags();
  }, []);

  return (
    <>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <h2>Add/Update Content</h2>
          <p>Please fill the content</p>
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
                label="Nama"
                name="name"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Nomor HP"
                name="no_phone"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Address"
                name="address"
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
                label="Perusahaan"
                name="perusahaan"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Target"
                name="target"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Aktual"
                name="actual"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Tahun"
                name="year"
                
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

export default ADD_INSTANSI;