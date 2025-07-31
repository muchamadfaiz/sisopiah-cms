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
import { fetchAllWajib, deleteWajib } from "redux/features/wajib_pajak";

let IDRFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'IDR',
});

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
        okText="Are you sure?"
        cancelText="Cancel"
      >
        <p>Bla bla ...</p>
        <p>Bla bla ...</p>
        <p>Bla bla ...</p>
      </Modal>
    </>
  );
};

export const PAJAK = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState();
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
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Perusahaan",
      dataIndex: "perusahaan",
      key: "perusahaan",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "No Phone",
      dataIndex: "no_phone",
      key: "no_phone",
    },
    {
      title: "Target",
      dataIndex: "target",
      key: "target",
      render: (_, record) => (
        <div>
          {IDRFormat.format(record.target)}
        </div>
      ),
    },
    {
      title: "Aktual",
      dataIndex: "actual",
      key: "actual",
      render: (_, record) => (
        <div>
          {IDRFormat.format(record.actual)}
        </div>
      ),
    },
    {
      title: "Persentase",
      dataIndex: "persentase",
      key: "persentase",
      render: (_, record) => {
        const percentage = (parseFloat(record.actual) / parseFloat(record.target)) * 100;
        let color;
      
        if (percentage < 50) {
          color = "red";
        } else if (percentage >= 50 && percentage <= 70) {
          color = "orange";
        } else if (percentage > 70) {
          color = "green";
        }
      
        return (
          <div>
            <h3 style={{ color: color }}>
              {`${percentage.toFixed(2)}%`}
            </h3>
          </div>
        );
      }
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
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
                pathname: `${strings.navigation.path.detail_wajib}`,
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
              confirm(record?.id);
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
      const response = await dispatch(fetchAllWajib(params)).unwrap();
      // console.log(response.data.data)
      setMetaData(response.meta);
      setData(response.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
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
        await dispatch(deleteWajib(id));
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
  }, [filters]);

  return (
    <>
      <LocalizedModal></LocalizedModal>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <h2>Instansi</h2>
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
              scroll={{ x: 'max-content' }} // enables horizontal scrolling
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
                pathname: `${strings.navigation.path.detail_wajib}`,
              });
            }}
            block
          >
            Tambah Instansi
          </Button>
        </Col>
      </Row>
      {contextHolder}
    </>
  );
};

export default withRouter(PAJAK);
