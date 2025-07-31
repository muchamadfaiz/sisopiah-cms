import {
  Button,
  Card,
  Col,
  message,
  Row,
  Table,
  Input,
  Modal,
  Form,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState, useCallback } from "react";
import { useHistory, withRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import { strings } from "res";
import moment from "moment";
import { deleteTags, fetchAllTags } from "redux/features/tags";
import _ from "lodash";

const LocalizedModal = () => {
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const hideModal = () => {
    setOpen(false);
  };
  return (
    <>
      <Modal
        title="Modal"
        open={open}
        onOk={hideModal}
        onCancel={hideModal}
        okText="确认"
        cancelText="取消"
      >
        <p>Bla bla ...</p>
        <p>Bla bla ...</p>
        <p>Bla bla ...</p>
      </Modal>
    </>
  );
};

export const TAGS = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [modal, contextHolder] = Modal.useModal();

  const { Search } = Input;

  const tableColumns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: () => <div className="text-center">Detail</div>,
      key: "status",
      render: (_, record) => (
        <div className="text-center">
          <Button
            type="primary"
            style={{ textAlign: "center" }}
            onClick={() => {
              history.push({
                pathname: `${strings.navigation.path.detail_tag}`,
                state: record,
              });
            }}
          >
            Detail
          </Button>
        </div>
      ),
    },
    {
      title: () => <div className="text-center">Action</div>,
      key: "status",
      render: (_, record) => (
        <div className="text-center">
          <Button
            type="danger"
            style={{ textAlign: "center", color: "white" }}
            onClick={() => {
              confirm(record.id);
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const getData = async (filter = "") => {
    try {
      const response = await dispatch(
        fetchAllTags({
          name: filter,
        })
      ).unwrap();
      setData(response.data);
      setLoading(false);
    } catch (error) {
      message.error(error?.message || "Failed to fetch data");
    }
  };

  const debouncedSearch = useCallback(
    _.debounce((term) => {
      getData(term);
    }, 500),
    []
  );

  const handleFilterChange = (e) => {
    const { value } = e.target;
    debouncedSearch(value);
  };

  const confirm = (id) => {
    modal.confirm({
      title: "Are you sure?",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure wanna delete this?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        await dispatch(deleteTags(id));
        getData();
      },
      onCancel: () => {},
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <LocalizedModal></LocalizedModal>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <h2>Tags</h2>
          <p>All Tags</p>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card>
            <Form.Item label="Search">
              <Input
                placeholder="Search Tag Name"
                onChange={handleFilterChange}
              ></Input>
            </Form.Item>
            <Table
              className="no-border-last"
              columns={tableColumns}
              dataSource={data}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Button
            type="primary"
            style={{ border: "0px" }}
            htmlType="submit"
            onClick={() => {
              history.push({
                pathname: `${strings.navigation.path.detail_tag}`,
              });
            }}
            block
          >
            Add New Tags
          </Button>
        </Col>
      </Row>
      {contextHolder}
    </>
  );
};

export default withRouter(TAGS);
