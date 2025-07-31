import { Button, Card, Col, message, Row, Table, Input, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState, useCallback } from "react";
import { useHistory, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { strings } from "res";
import { fetchAllWajib, deleteWajib } from "redux/features/wajib_pajak";
import moment from "moment";

// Format the price above to USD using the locale, style, and currency.
let IDRFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'IDR',
});

const LocalizedModal = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState();
  const [metaData, setMetaData] = useState({});
  
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

  const getData = async () => {
    try {
      const response = await dispatch(fetchAllWajib()).unwrap();
      setData(response.data.data);
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
        await dispatch(deleteWajib(id));
        getData();
      },
      onCancel: () => { },
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
          <h2>Perushaan Wajib CSR Provinsi Sumatera Selatan</h2>
          <p>Daftar semua perushaan wajib CSR provinsi Sumatera Selatan</p>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card>
            <Input placeholder="Search By Title"></Input>
            <Table
              className="no-border-last"
              scroll={{ x: 'max-content' }} // enables horizontal scrolling
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
                pathname: `${strings.navigation.path.detail_wajib}`,
              });
            }}
            block
          >
            Tambah Wajib CSR
          </Button>
        </Col>
      </Row>
      {contextHolder}
    </>
  );
};

export default withRouter(VENDOR);
