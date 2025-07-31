import { Button, Card, Col, message, Row, Table, Input, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState, useCallback } from "react";
import { useHistory, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { strings } from "res";
import { fetchAllCategory, deleteCategory } from "redux/features/category";
import moment from "moment";
import { fetchAllSubcategory } from "redux/features/subcategory";
import categories from "../categories";

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

export const SUBCATEGORY = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [metaData, setMetaData] = useState({});
  const [modal, contextHolder] = Modal.useModal();
  const [categories, setCategories] = useState();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
  });

  const { Search } = Input;

  const tableColumns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Subcategory",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "category_id",
      key: "name",
      render: (_, record) => (
        <div>
          {categories
            ?.filter((item) => item.value === record.category_id)
            .map((item) => item.label)}
        </div>
      ),
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
                pathname: `${strings.navigation.path.detail_subcategory}`,
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

  const getData = async () => {
    try {
      const response = await dispatch(fetchAllSubcategory(filters)).unwrap();
      setData(response.data);
      setMetaData(response.meta);
      setLoading(false);
    } catch (error) {
      message.error(error?.message || "Failed to fetch data");
    }
  };

  const confirm = (id) => {
    modal.confirm({
      title: "Are you sure?",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure wanna delete this?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        await dispatch(deleteCategory(id));
        getData();
      },
      onCancel: () => {},
    });
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setFilters({ ...filters, page: pagination.current });
  };

  useEffect(() => {
    getData();
    getCategories();
  }, []);

  return (
    <>
      <LocalizedModal></LocalizedModal>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <h2>Subcategories</h2>
          <p>All Subcategories</p>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card>
            <Input placeholder="Search By Title"></Input>
            <Table
              className="no-border-last"
              columns={tableColumns}
              dataSource={data}
              rowKey="id"
              pagination={{
                defaultPageSize: 10,
                defaultCurrent: 1,
                total: metaData.totalData,
              }}
              onChange={handleTableChange}
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
                pathname: `${strings.navigation.path.detail_subcategory}`,
              });
            }}
            block
          >
            Add New Subcategory
          </Button>
        </Col>
      </Row>
      {contextHolder}
    </>
  );
};

export default withRouter(SUBCATEGORY);
