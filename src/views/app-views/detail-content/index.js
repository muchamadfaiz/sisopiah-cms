import { Col, DatePicker, Row, Tabs, message } from "antd";
import React, { useEffect, useState } from "react";
import { Button, Card, Form, Input } from "antd";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Select } from "antd";
import {
  addContent,
  fetchOneContent,
  updateContent,
} from "redux/features/content";
import { MyEditor } from "../../../components/Editor";
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

export const ADD_CONTENT = () => {
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
        addContent({
          user_id: 1,
          title: values.title,
          title_en: values.title_en,
          author: values.author,
          thumbnail: imgUrl,
          description: values.description,
          pelaksana: values.pelaksana,
          perusahaan: values.perusahaan,
          file: values.file,
          body: idBody,
          body_en: enBody,
          subcategory_id: values.subcategory_id,
          tag_ids: values.content_tags,
          date_published: moment(values.date_published).format("YYYY-MM-DD"),
        })
      ).unwrap();
      history.push("/app/contents");
    } catch (error) {
      message.error(error?.message || "Failed to fetch data");
    }
  };

  const updateData = async (values) => {
    try {
      await dispatch(
        updateContent({
          user_id: 1,
          id: location?.state?.id,
          title: values.title,
          title_en: values.title_en,
          author: values.author,
          thumbnail: imgUrl,
          pelaksana: values.pelaksana,
          perusahaan: values.perusahaan,
          description: values.description,
          file: values.file,
          body: idBody,
          body_en: enBody,
          subcategory_id: values.subcategory_id,
          tag_ids: values.content_tags,
          date_published: moment(values.date_published).format("YYYY-MM-DD"),
        })
      ).unwrap();
      history.push("/app/contents");
    } catch (error) {
      message.error(error?.message || "Failed to fetch data");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const getDataById = async (id) => {
    try {
      const data = await dispatch(fetchOneContent(id)).unwrap();
      form.setFieldsValue({
        ...data.data,
        category: data.data.category_id,
        content_tags: data.data.content_tags.map((item) => item.tag_id),
        date_published: moment(data.data.date_published),
      });
      setEnBody(data?.data.body_en);
      setIdBody(data?.data.body);
      setImgUrl(data.data.thumbnail);
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
                label="Title (EN)"
                name="title_en"
                rules={[
                  {
                    required: true,
                    message: "Please input your title!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Title (ID)"
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Please input your title!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Author"
                name="author"
                rules={[
                  {
                    required: true,
                    message: "Please input author!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Thumbnail"
                name="thumbnail"
                rules={[
                  {
                    required: true,
                    message: "Please upload your Thumbnail",
                  },
                ]}
              >
                <ImageUploader imageUrl={imgUrl} onChange={handleImageUpload} />
              </Form.Item>

              <Form.Item
                label="File URL"
                name="file"
                rules={[
                  {
                    required: true,
                    message: "Please input your file URL!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Pelaksana"
                name="pelaksana"
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
                label="Description (Max 255 Characters)"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Please input your description!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Subcategory"
                name="subcategory_id"
                rules={rules}
              >
                <Select
                  defaultValue="Not Picked"
                  style={selectStyle}
                  options={subcategories}
                />
              </Form.Item>

              <Form.Item label="Tags" name="content_tags" rules={rules}>
                <Select
                  mode="multiple"
                  allowClear
                  style={{
                    width: "100%",
                  }}
                  placeholder="Please select"
                  onChange={(value) => {
                    console.log(`selected ${value}`);
                  }}
                  options={tags}
                />
              </Form.Item>

              <Form.Item
                label="Date Published"
                name="date_published"
                rules={rules}
              >
                <DatePicker />
              </Form.Item>

              <Tabs>
                <Tabs.TabPane tab="Indonesian" key="item-1">
                  <p>Writes Content in Indonesian</p>
                  <Form.Item>
                    <MyEditor
                      data={idBody}
                      setState={setIdBody}
                      defaultValue="Indonesian Content"
                    />
                  </Form.Item>
                </Tabs.TabPane>
                <Tabs.TabPane tab="English" key="item-2">
                  <p>Writes Content in English</p>
                  <Form.Item>
                    <MyEditor
                      data={enBody}
                      setState={setEnBody}
                      defaultValue="English Content"
                    />
                  </Form.Item>
                </Tabs.TabPane>
              </Tabs>

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

export default ADD_CONTENT;