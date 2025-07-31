import {
  Button,
  Card,
  Col,
  message,
  Row,
  Table,
  Input,
  Modal,
  Select,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useHistory, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { strings } from "res";
import { fetchAllContent, deleteContent } from "redux/features/content";
import moment from "moment";
import { fetchAllCategory } from "redux/features/category";
import { getUserProfile } from "redux/features/auth";
import { capitalize, filter } from "lodash";
import { fetchAllSubcategory } from "redux/features/subcategory";
import { fetchAllTags } from "redux/features/tags";

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

export const CONTENTS = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [role, setRole] = useState("");
  const [metaData, setMetaData] = useState({});
  const [modal, contextHolder] = Modal.useModal();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sort: "created_at",
  });

  const tableColumns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (_, record) => (
        <div style={{ margin: "auto", display: "flex" }}>
          <img src={record.thumbnail} style={{ width: "15%" }}></img>
        </div>
      ),
    },
    {
      title: "Perusahaan",
      dataIndex: "perusahaan",
      key: "perusahaan",
    },
    {
      title: "Pelaksana",
      dataIndex: "pelaksana",
      key: "pelaksana",
    },
    // {
    //   title: "Subcategory",
    //   dataIndex: "subcategory",
    //   key: "subcategory",
    //   render: (_, record) => {
    //     return capitalize(record?.subcategory?.name);
    //   },
    // },
    // {
    //   title: "Category",
    //   dataIndex: "category",
    //   key: "category",
    //   render: (_, record) => {
    //     return categories.find((item) => item.value === record.category_id)
    //       ?.label;
    //   },
    // },
    {
      title: "Tanggal Terbit",
      dataIndex: "date_published",
      key: "date_published",
      sorter: true,
      render: (_, record) =>
        record.date_published
          ? moment(record.date_published).format("DD-MM-YYYY")
          : "-",
    },
    {
      title: "Tanggal Dibuat",
      dataIndex: "created_at",
      key: "created_at",
      render: (_, record) =>
        record.created_at
          ? moment(record.created_at).format("DD-MM-YYYY")
          : "-",
    },
    {
      title: () => <div className="text-center">Detail</div>,
      key: "detail",
      render: (_, record) => (
        <div className="text-center">
          <Button
            type="primary"
            style={{ textAlign: "center" }}
            onClick={() => {
              history.push({
                pathname: `${strings.navigation.path.detail_content}`,
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

  const getData = async (params) => {
    try {
      setLoading(true);
      const response = await dispatch(fetchAllContent(params)).unwrap();
      setMetaData(response.meta.page);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(error?.message || "Failed to fetch data");
    }
  };

  const getProfile = async () => {
    try {
      const response = await dispatch(getUserProfile()).unwrap();
      console.log("Panggil Profile")
      console.log(response)
    } catch (error) {
      setLoading(false);
      message.error(error?.message || "Failed to fetch data");
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

  const getSubcategories = async () => {
    try {
      const response = await dispatch(
        fetchAllSubcategory({
          limit: 100,
        })
      ).unwrap();
      setSubcategories(
        response.data.map((subcategory) => {
          return {
            value: subcategory.id,
            label: capitalize(subcategory.name),
          };
        })
      );
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
        await dispatch(deleteContent(id));
        getData(filters);
      },
      onCancel: () => {},
    });
  };

  const handleCategorySelect = (val) => {
    setFilters({ ...filters, category_id: val });
  };

  const handleSubcategorySelect = (val) => {
    setFilters({ ...filters, subcategory_id: val });
  };

  const handleTableChange = (pagination, filters, sorter) => {
    //sort by date_published
    let sorterKey = "";
    if (sorter.field === "date_published" && sorter.order) {
      sorterKey = sorter.order === "ascend" ? sorter.field : `-${sorter.field}`;
      setFilters({ ...filters, page: 1, sort: sorterKey });
    }

    if (sorter.field === "created_at" && sorter.order) {
      sorterKey = sorter.order === "ascend" ? sorter.field : `-${sorter.field}`;
      setFilters({ ...filters, page: 1, sort: sorterKey });
    }

    setFilters({ ...filters, page: pagination.current, sort: sorterKey });
  };

  useEffect(() => {
    getData(filters);
    getCategories();
    getSubcategories();
    getProfile()
    // getTags();
  }, []);

  useMemo(() => {
    getData(filters);
  }, [filters]);

  return (
    <>
      <LocalizedModal></LocalizedModal>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <h2>Berita Acara Serah Terima (Program SROI)</h2>
          <p>Semua proyek yang berhasil diterapkan beserta sertifikasi E-CSR</p>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card>
            <Row>
              <Col xs={24} sm={24} md={6} lg={6}>
                <Select
                  placeholder="Filter by category"
                  onSelect={handleCategorySelect}
                  options={categories}
                  className="mb-4 mr-4"
                  allowClear
                  onClear={handleCategorySelect}
                  style={{ width: "100%" }}
                />
              </Col>
              <Col xs={24} sm={24} md={6} lg={6}>
                <Select
                  placeholder="Filter by subcategory"
                  onSelect={handleSubcategorySelect}
                  options={subcategories}
                  className="mb-4 mr-4"
                  allowClear
                  onClear={handleSubcategorySelect}
                  style={{ width: "100%" }}
                />
              </Col>
            </Row>
            {/* <Select
              placeholder="Filter by tags"
              onSelect={handleTagSelect}
              options={tags}
              className="mb-4 mr-4"
              allowClear
              onClear={handleTagSelect}
            /> */}
            <Table
              className="no-border-last"
              style={{ textAlign: "center", margin: "auto" }}
              columns={tableColumns}
              dataSource={data}
              rowKey="id"
              loading={isLoading}
              pagination={{
                defaultPageSize: 10,
                defaultCurrent: 1,
                total: metaData.total_data,
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
                pathname: `${strings.navigation.path.detail_content}`,
              });
            }}
            block
          >
            Add New Content
          </Button>
        </Col>
      </Row>
      {contextHolder}
    </>
  );
};

export default withRouter(CONTENTS);
