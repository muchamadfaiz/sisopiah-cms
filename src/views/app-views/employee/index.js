import { Button, Card, Col, message, Row, Table, Input, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState, useCallback } from "react";
import { useHistory, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { strings } from "res";
import { fetchAllProjects, deleteProject } from "redux/features/projects";
import { getUserProfile } from "redux/features/auth";
import moment from "moment";
import { deleteEmployee, fetchAllEmployees } from "redux/features/employee";

// Format the price above to USD using the locale, style, and currency.
let IDRFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "IDR",
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
      <Modal title="Modal" open={open} onOk={hideModal} onCancel={hideModal} okText="Ok" cancelText="Cancel">
        <p>Anda yakin ingin melakukan aksi ini?</p>
      </Modal>
    </>
  );
};

export const EMPLOYEE = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [role, setRole] = useState(0);
  const [metaData, setMetaData] = useState({});
  const [modal, contextHolder] = Modal.useModal();

  const [filters, setFilters] = useState({
    page: 1,
    limit: 1000,
  });

  const getProfile = async () => {
    try {
      console.log("Sending token:", localStorage.getItem("token"));
      const response = await dispatch(getUserProfile()).unwrap();
      setRole(response.data.user.role_id);
    } catch (error) {
      //   setLoading(false);
      message.error(error?.message || "Failed to fetch data");
    }
  };

  const tableColumns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      render: (_text, _record, index) => (filters.page - 1) * filters.limit + index + 1,
    },
    {
      title: "NIP",
      dataIndex: "nip",
      key: "nip",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Jabatan",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "Nama Bank",
      dataIndex: "bank_name",
      key: "bank_name",
    },
    {
      title: "Nama akun bank",
      dataIndex: "bank_account_name",
      key: "bank_account_name",
    },
    {
      title: "Nomor akun bank",
      dataIndex: "bank_account_number",
      key: "bank_account_number",
    },
    {
      title: "Bergabung sejak",
      dataIndex: "joined_at",
      key: "joined_at",
      render: (text) => moment(text).format("DD-MM-YYYY"),
    },
    {
      title: () => <div className="text-center">Detail</div>,
      key: "status",
      fixed: "right",
      render: (_, record) => {
        if (role !== 1) {
          return (
            <div className="text-center">
              <Button
                type="primary"
                style={{ textAlign: "center", color: "white" }}
                onClick={() => {
                  // confirm(record?.id);
                  history.push({
                    pathname: `${strings.navigation.path.detail_employee}`,
                    state: record,
                  });
                }}
              >
                {/* Lihat Dapur */}
                Detail
              </Button>
            </div>
          );
        } else {
          return (
            <div className="text-center">
              <Button
                type="primary"
                style={{ textAlign: "center", color: "white" }}
                onClick={() => {
                  // confirm(record?.id);
                  history.push({
                    pathname: `${strings.navigation.path.detail_project}`,
                    state: record,
                  });
                }}
              >
                Detail Dapur
              </Button>
            </div>
          );
        }
      },
    },
    {
      title: () => <div className="text-center">Action</div>,
      key: "status",
      fixed: "right",
      render: (_, record) => {
        if (role !== 1) {
          return (
            <div className="text-center">
              <Button
                type="danger"
                style={{ textAlign: "center", color: "white" }}
                onClick={() => {
                  confirm(record?.id);
                  //   history.push({
                  //     pathname: `${strings.navigation.path.detail_guardian}`,
                  //     state: record,
                  //   });
                }}
              >
                {/* Lihat Dapur */}
                Delete
              </Button>
            </div>
          );
        } else {
          return (
            <div className="text-center">
              <Button
                type="danger"
                style={{ textAlign: "center", color: "white" }}
                onClick={() => {
                  // confirm(record?.id);
                  history.push({
                    pathname: `${strings.navigation.path.detail_project}`,
                    state: record,
                  });
                }}
              >
                Delete
              </Button>
            </div>
          );
        }
      },
    },
  ];

  const getData = async (params) => {
    try {
      //   setLoading(true);
      const response = await dispatch(fetchAllEmployees(params)).unwrap();
      console.log("hahai: ", response.data);
      //   setData(response.data.Projects);
      setData(response.data);
      setMetaData(response.meta);
      //   setLoading(false);
    } catch (error) {
      //   setLoading(false);
      message.error(error?.message || "Failed to fetch data");
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    //sort by date_published
    let sorterKey = "";
    // if (sorter.field === "date_published" && sorter.order) {
    //   sorterKey = sorter.order === "ascend" ? sorter.field : `-${sorter.field}`;
    //   setFilters({ ...filters, page: 1, sort: sorterKey });
    // }

    // if (sorter.field === "created_at" && sorter.order) {
    //   sorterKey = sorter.order === "ascend" ? sorter.field : `-${sorter.field}`;
    //   setFilters({ ...filters, page: 1, sort: sorterKey });
    // }

    setFilters({ ...filters, page: pagination.current, sort: sorterKey });
  };

  const handleSearchByTitle = (event) => {
    setFilters({ ...filters, name: event.target.value });
  };

  const confirm = (id) => {
    modal.confirm({
      title: "Are you sure?",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure wanna delete this?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        await dispatch(deleteEmployee(id));
        getData();
      },
      onCancel: () => {},
    });
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        //   await getProfile();
        await getData(filters);
      } catch (error) {
        message.error("Terjadi kesalahan saat memuat data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [filters]);

  return (
    <>
      <LocalizedModal></LocalizedModal>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <h2>Staff di SiSopiah</h2>
          <p>Daftar semua staff di SiSopiah</p>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card>
            <Row gutter={[6, 6]}>
              <Col md={8} xl={8} sm={24}>
                <Input
                  onChange={handleSearchByTitle}
                  name="name"
                  placeholder="Cari Berdasarkan Nama Staff"
                  allowClear
                />
              </Col>
            </Row>
            <Table
              className="no-border-last"
              columns={tableColumns}
              scroll={{ x: "max-content" }} // enables horizontal scrolling
              dataSource={data}
              rowKey="id"
              pagination={{
                defaultPageSize: 10,
                defaultCurrent: 1,
                total: metaData.total_data,
              }}
              loading={isLoading}
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
                pathname: `${strings.navigation.path.detail_employee}`,
              });
            }}
            block
          >
            Tambahkan Staff
          </Button>
        </Col>
      </Row>
      {contextHolder}
    </>
  );
};

export default withRouter(EMPLOYEE);
