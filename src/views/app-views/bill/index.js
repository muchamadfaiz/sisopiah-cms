import { Button, Card, Col, message, Row, Table, Input, Modal, Tag, Select, DatePicker } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState, useCallback } from "react";
import { useHistory, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { strings } from "res";
import { fetchAllProjects, deleteProject } from "redux/features/projects";
import { getUserProfile } from "redux/features/auth";
import moment from "moment";
import { deleteBill, fetchAllBills } from "redux/features/bill";
import Utils from "../../../utils/index"
import { fetchAllStudents } from "redux/features/students";

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
        okText="Ok"
        cancelText="Cancel"
      >
        <p>Anda yakin ingin melakukan aksi ini?</p>
      </Modal>
    </>
  );
}

const statusColorMap = {
  true: "green", 
  false: "red",      
};

export const BILL = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [role, setRole] = useState(0);
  const [metaData, setMetaData] = useState({});
  const [modal, contextHolder] = Modal.useModal();
  const [subcategories, setSubcategories] = useState([]);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 1000,
    // perusahaan: "BELUM ADA",
    // status: "OPEN"
  });

  const { Search } = Input;

  const getProfile = async () => {
    try {
      console.log('Sending token:', localStorage.getItem('token'));
      const response = await dispatch(getUserProfile()).unwrap();
      setRole(response.data.user.role_id)
    } catch (error) {
    //   setLoading(false);
      message.error(error?.message || "Failed to fetch data");
    }
  };

  const genderMap = {
    P: "Perempuan",
    L: "Laki-laki"
  };

  const tableColumns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      render: (_text, _record, index) =>
        (filters.page - 1) * filters.limit + index + 1,
    },
    {
      title: "Nama",
      dataIndex: "student",
      key: "student",
      render: (student) => student?.name || "-",
    },
    {
      title: "Judul",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Deskripsi",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Jumlah",
      dataIndex: "amount",
      key: "amount",
      render: (text) =>
        text ? `Rp ${Number(text).toLocaleString("id-ID")}` : "-"
    },
    {
      title: "Jatuh Tempo",
      dataIndex: "due_date",
      key: "due_date",
      render: (text) => moment(text).format("DD-MM-YYYY"),
    },
    {
      title: "Status",
      dataIndex: "is_paid",
      key: "is_paid",
       render: (value) => (
        <Tag color={statusColorMap[value]}>
            {value ? "Lunas" : "Belum Lunas"}
        </Tag>
  ),
    },
    {
      title: "Tanggal Bayar",
      dataIndex: "paid_at",
      key: "paid_at",
      render: (text) => moment(text).format("DD-MM-YYYY"),
    },
    {
      title: "Metode Pembayaran",
      dataIndex: "payment_method",
      key: "payment_method",
      render: (text) => Utils.capitalize(text) || "-",
    },
        {
      title: "Link Pembayaran",
      dataIndex: "payment_link",
      key: "payment_link",
    },
    // {
    //   title: "Wali Murid",
    //   dataIndex: "guardians",
    //   key: "guardians",
    //   render: (_, record) => {
    //     const guardian = record.guardians?.[0]?.guardian
    //     return guardian ? guardian.name : "-"
    //     }
    // },
    {
      title: () => <div className="text-center">Detail</div>,
      key: "status",
      fixed: 'right',
      render: (_, record) => {
        if (role !== 1) 
            {
          return (
            <div className="text-center">
              <Button
                type="primary"
                style={{ textAlign: "center", color: "white" }}
                onClick={() => {
                  // confirm(record?.id);
                  history.push({
                    pathname: `${strings.navigation.path.detail_bill}`,
                    state: record,
                  });
                }}
              >
                {/* Lihat Dapur */}
                Detail
              </Button>
            </div>
          )
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
          )
        }
      }
    },
    {
          title: () => <div className="text-center">Action</div>,
          key: "status",
          fixed: 'right',
          render: (_, record) => {
            if (role !== 1) 
                {
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
              )
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
              )
            }
          }
        },
  ];

  const getData = async (params) => {
    try {
    //   setLoading(true);
      const response = await dispatch(fetchAllBills(params)).unwrap();
      console.log('hahai: ', response.data)
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
    // setFilters({ ...filters, name:event.target.value });
  }

  const handleSearchByStudentId = (value) => {
        setFilters({
        ...filters,
        student_id: value, 
        });
  }

  const handleDueDateRangeChange = (dates) => {
  setFilters({
    ...filters,
    due_date_from: dates?.[0]?.format("YYYY-MM-DD") || undefined,
    due_date_to: dates?.[1]?.format("YYYY-MM-DD") || undefined,
  });
 };

   const handlePaidAtRangeChange = (dates) => {
  setFilters({
    ...filters,
    paid_at_from: dates?.[0]?.format("YYYY-MM-DD") || undefined,
    paid_at_to: dates?.[1]?.format("YYYY-MM-DD") || undefined,
  });
 };


  const confirm = (id) => {
    modal.confirm({
      title: "Are you sure?",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure wanna delete this?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        await dispatch(deleteBill(id));
        getData();
      },
      onCancel: () => { },
    });
  };

//   useEffect(() => {
//     getData(filters);
//     getProfile()
//   }, [filters]);

const getSubcategories = async () => {
    try {
      const response = await dispatch(fetchAllStudents()).unwrap();
      console.log('response: ', response);
      setSubcategories(
        response.data.map((guardian) => {
          return {
            value: guardian.id,
            label: guardian.name,
          };
        })
      );
    } catch (error) {
      message.error(error?.message || "Failed to fetch data");
    }
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


// Fetch all students once, when the component mounts
  useEffect(()=> {
    getSubcategories()
  },[])

  return (
    <>
      <LocalizedModal></LocalizedModal>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <h2>Tagihan</h2>
          <p>Daftar semua tagihan</p>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card>
            <Row gutter={[6, 6]}>
              <Col md={8} xl={8} sm={24} >
                {/* <Input onChange={handleSearchByTitle} name="name" placeholder="Cari Berdasarkan Nama Murid" allowClear/> */}
                <Select
                    // mode="multiple"
                    showSearch
                    allowClear
                    placeholder="Cari Berdasarkan Nama Murid"
                    // optionFilterProp="children"
                    style={{ width: "100%" }}
                    value={filters.student_id || undefined} 
                    onChange={handleSearchByStudentId}
                    filterOption={(input, option) =>
                        option?.children?.toLowerCase().includes(input.toLowerCase())
                    }
                >
                    {subcategories.map((student) => (
                        <Select.Option key={student.value} value={student.value}>
                        {student.label}
                        </Select.Option>
                    ))}
                </Select>
              </Col>
              <Col md={8} xl={8} sm={24}>
              {/* <div style={{ marginBottom: 4, fontWeight: 500 }}>Jatuh Tempo</div> */}
                <DatePicker.RangePicker
                style={{ width: "100%" }}
                format="DD-MM-YYYY"
                placeholder={["Jatuh Tempo Dari", "Jatuh Tempo Sampai"]}
                onChange={handleDueDateRangeChange}
                />
              </Col>
               <Col md={8} xl={8} sm={24}>
               {/* <div style={{ marginBottom: 4, fontWeight: 500 }}>Tanggal Bayar</div> */}
                <DatePicker.RangePicker
                style={{ width: "100%" }}
                format="DD-MM-YYYY"
                placeholder={["Tanggal Bayar Dari", "Tanggal Bayar Sampai"]}
                onChange={handlePaidAtRangeChange}
                />
              </Col>
              {/* <Col md={4} xl={4} sm={24} >
                <Input onChange={() => {}} name="opd" placeholder="OPD"></Input>
              </Col>
              <Col md={4} xl={4} sm={24} >
                <Input onChange={() => {}} name="owner" placeholder="Perusahaan"></Input>
              </Col> */}
              <Col md={4} xl={4} sm={24} >
                <Button type="primary" style={{ width: "100%" }}>Cari</Button>
              </Col>
            </Row>
            <Table
              className="no-border-last"
              columns={tableColumns}
              scroll={{ x: 'max-content' }} // enables horizontal scrolling
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
                pathname: `${strings.navigation.path.detail_bill}`,
              });
            }}
            block
          >
            Tambahkan Tagihan
          </Button>
        </Col>
      </Row>
      {contextHolder}
    </>
  );
};

export default withRouter(BILL);
