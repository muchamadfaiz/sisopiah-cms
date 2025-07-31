import { Button, Card, Col, message, Row, Table, Input, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState, useCallback } from "react";
import { useHistory, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { strings } from "res";
import { fetchAllVendor, deleteProject } from "redux/features/vendor";
import moment from "moment";

// Format the price above to USD using the locale, style, and currency.
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

export const VENDOR = () => {
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
      title: "Nominal",
      dataIndex: "cost",
      key: "cost",
      render: (_, record) => (
        <div>
          {IDRFormat.format(record.cost)}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "vendor_id",
      key: "vendor_id",
      render: (_, record) => (
        <div>
          {record.vendor_id === 1 ? <div style={{color:"green",font:"bold"}}>Open</div> : "Open"}
        </div>
      ),
    },
    {
      title: "Pemilik Project",
      dataIndex: "category_id",
      key: "category_id",
      render: (_, record) => (
        <div>
          {"Bappeda Sumatera Selatan"}
        </div>
      ),
    },
    {
      title: "Pelaksana",
      dataIndex: "vendor_id",
      key: "vendor_id",
      render: (_, record) => (
        <div>
          {<div style={{color:"red",font:"bold"}}>Belum Ditentukan</div>}
        </div>
      ),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (_, record) => (
        <div>
          {moment(record.startDate).format("DD-MM-YYYY")}
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
                pathname: `${strings.navigation.path.detail_project}`,
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

  const getData = async () => {
    try {
      const response = await dispatch(fetchAllVendor()).unwrap();
      setData(response.data.VENDOR);
      console.log(response)
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
        await dispatch(deleteProject(id));
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
          <h2>CSR VENDOR</h2>
          <p>All CSR VENDOR</p>
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
                pathname: `${strings.navigation.path.detail_project}`,
              });
            }}
            block
          >
            Add New Project
          </Button>
        </Col>
      </Row>
      {contextHolder}
    </>
  );
};

export default withRouter(VENDOR);
