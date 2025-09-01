import { Button, Card, Col, message, Row, Table, Input, Modal, Tag, Select, DatePicker, Space } from "antd";
import { ExclamationCircleOutlined, UploadOutlined } from "@ant-design/icons";
import React, { useEffect, useState, useCallback } from "react";
import { useHistory, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { strings } from "res";
import { fetchAllProjects, deleteProject } from "redux/features/projects";
import { getUserProfile } from "redux/features/auth";
import moment from "moment";
import { deleteBill, fetchAllBills } from "redux/features/bill";
import { deleteSalary, fetchAllSalaries, fetchAllWages } from "redux/features/salary";
import Utils from "../../../utils/index";
import { fetchAllStudents } from "redux/features/students";
import { fetchAllEmployees } from "redux/features/employee";

// Format the price above to USD using the locale, style, and currency.
// let IDRFormat = new Intl.NumberFormat("en-US", {
//   style: "currency",
//   currency: "IDR",
// });

let IDRFormat = {
  format: (value) => {
    if (value == null || isNaN(value)) return "Rp 0";
    return "Rp " + Number(value).toLocaleString("id-ID");
  },
};

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

// const statusColorMap = {
//   true: "green",
//   false: "red",
// };

const statusColorMap = {
  Draft: "default",
  Approved: "blue",
  Paid: "green",
  Unpaid: "red",
};

export const SALARY = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [role, setRole] = useState(0);
  const [metaData, setMetaData] = useState({});
  const [modal, contextHolder] = Modal.useModal();
  const [subcategories, setSubcategories] = useState([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const [isSlipOpen, setIsSlipOpen] = useState(false);
  const [slipData, setSlipData] = useState(null);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 1000,
    // perusahaan: "BELUM ADA",
    // status: "OPEN"
  });

  const dataDummy = [
    {
      id: "EMP001",
      nama: "Ani Sulastri",
      jabatan: "Guru",
      periode: "2025-08",
      take_home_pay: 3650000,
      payout_type: "ewallet",
      payout_provider: "Dana",
      payout_account_no: "081234567890",
      payout_date: "2025-08-10",
      status: "Draft",
    },
    {
      id: "EMP002",
      nama: "Budi Pratama",
      jabatan: "Staff TU",
      periode: "2025-08",
      take_home_pay: 3350000,
      payout_type: "bank",
      payout_provider: "BCA",
      payout_account_no: "1234567890",
      payout_date: "2025-08-10",
      status: "Approved",
    },
    {
      id: "EMP003",
      nama: "Citra Dewi",
      jabatan: "Kepala Sekolah",
      periode: "2025-08",
      take_home_pay: 7500000,
      payout_type: "bank",
      payout_provider: "Mandiri",
      payout_account_no: "9876543210",
      payout_date: "2025-08-10",
      status: "Paid",
    },
    {
      id: "EMP004",
      nama: "Dedi Santoso",
      jabatan: "Guru",
      periode: "2025-08",
      take_home_pay: 3100000,
      payout_type: "ewallet",
      payout_provider: "OVO",
      payout_account_no: "089876543210",
      payout_date: "2025-08-10",
      status: "Unpaid",
    },
  ];

  const statusOption = [
    {
      value: "Draft",
      label: "Draft",
    },
    {
      value: "Approved",
      label: "Approved",
    },
    {
      value: "Paid",
      label: "Paid",
    },
    {
      value: "Unpaid",
      label: "Unpaid",
    },
  ];

  const { Search } = Input;

  const getEmployee = async () => {
    try {
      const response = await dispatch(fetchAllEmployees()).unwrap();
      setSubcategories(
        response.data.map((emp) => ({
          value: emp.id,
          label: emp.name,
        }))
      );
    } catch (error) {
      message.error(error?.message || "Gagal memuat data karyawan");
    }
  };

  const openUpload = () => setIsUploadOpen(true);

  const openSlip = (record) => {
    setSlipData(record);
    setIsSlipOpen(true);
  };

  const closeSlip = () => {
    setIsSlipOpen(false);
    setSlipData(null);
  };

  const genderMap = {
    P: "Perempuan",
    L: "Laki-laki",
  };

  const tableColumns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      render: (_text, _record, index) => (filters.page - 1) * filters.limit + index + 1,
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Nama",
      dataIndex: ["employee", "name"],
      key: "nama",
    },
    {
      title: "Jabatan",
      dataIndex: ["employee", "position"],
      key: "jabatan",
    },
    {
      title: "Periode",
      dataIndex: ["period", "period_name"],
      key: "periode",
      render: (val) => val || "-",
    },
    {
      title: "Gaji Pokok",
      dataIndex: "base_salary",
      key: "base_salary",
      render: (val) => (val ? IDRFormat.format(val) : "-"),
    },
    {
      title: "T. Makan",
      key: "t_makan",
      render: (_, record) => {
        const makan = record.details?.find((d) => d.component?.id === 2);
        return makan ? IDRFormat.format(Number(makan.amount) * (makan.qty || 1)) : "-";
      },
    },
    {
      title: "T. Komunikasi",
      key: "t_komunikasi",
      render: (_, record) => {
        const komunikasi = record.details?.find((d) => d.component?.id === 4);
        return komunikasi ? IDRFormat.format(Number(komunikasi.amount) * (komunikasi.qty || 1)) : "-";
      },
    },
    {
      title: "T. Transport",
      key: "t_transport",
      render: (_, record) => {
        const transport = record.details?.find((d) => d.component?.id === 4);
        return transport ? IDRFormat.format(Number(transport.amount) * (transport.qty || 1)) : "-";
      },
    },

    {
      title: "T. Jabatan",
      key: "t_jabatan",
      render: (_, record) => {
        const jabatan = record.details?.find((d) => d.component?.id === 4);
        return jabatan ? IDRFormat.format(Number(jabatan.amount) * (jabatan.qty || 1)) : "-";
      },
    },
    {
      title: "T. Lainnya",
      key: "t_lainnya",
      render: (_, record) => {
        const lainnya = record.details?.find((d) => d.component?.id === 4);
        return lainnya ? IDRFormat.format(Number(lainnya.amount) * (lainnya.qty || 1)) : "-";
      },
    },
    {
      title: "Bonus",
      key: "bonus",
      render: (_, record) => {
        const bonus = record.details?.find((d) => d.component?.id === 10);
        return bonus ? IDRFormat.format(Number(bonus.amount)) : "-";
      },
    },
    {
      title: "Potongan",
      key: "potongan",
      render: (_, record) => {
        const potongan = record.details?.find((d) => d.component?.id === 11);
        return potongan ? IDRFormat.format(Number(potongan.amount)) : "-";
      },
    },
    {
      title: "THP",
      dataIndex: "total_earning",
      key: "take_home_pay",
      //   render: (val) => (val != null ? IDRFormat.format(val) : "-"),
      render: (_, record) => {
        // ambil gaji pokok
        const gapok = Number(record.base_salary || 0);

        // ambil detail komponen
        const details = record.details || [];

        // jumlahkan allowance + bonus
        const allowanceAndBonus = details
          .filter((d) => ["allowance", "bonus"].includes(d.component?.type))
          .reduce((sum, d) => sum + Number(d.amount || 0) * (d.qty || 1), 0);

        // jumlahkan potongan
        const deductions = details
          .filter((d) => d.component?.type === "deduction")
          .reduce((sum, d) => sum + Number(d.amount || 0) * (d.qty || 1), 0);

        // hitung THP
        const thp = gapok + allowanceAndBonus - deductions;

        return IDRFormat.format(thp);
      },
    },
    {
      title: "Bank",
      dataIndex: ["employee", "bank_name"],
      key: "bank_name",
      render: (_, record) => (record.nomor_rekening ? record.employee?.bank_name || "-" : "-"),
    },
    {
      title: "No Rekening",
      dataIndex: "nomor_rekening",
      key: "nomor_rekening",
      render: (val, record) => val || record.employee?.bank_account_number || "-",
    },
    {
      title: "Status",
      dataIndex: "is_paid",
      key: "status",
      render: (val) => {
        const label = val ? "Paid" : "Unpaid";
        const color = val ? "green" : "red";
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Detail",
      key: "detail",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => {
            history.push({
              pathname: `${strings.navigation.path.detail_salary}`,
              state: record,
            });
          }}
        >
          Detail
        </Button>
      ),
    },
    {
      title: "Aksi",
      key: "aksi",
      render: (_, record) => (
        <Space>
          <Button onClick={() => openSlip(record)}>Lihat Slip</Button>
          <Button style={{ textAlign: "center", color: "white" }} type="danger" onClick={() => confirm(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const getData = async (params) => {
    try {
      //   setLoading(true);
      const response = await dispatch(fetchAllSalaries(params)).unwrap();
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
    // setFilters({ ...filters, name:event.target.value });
  };

  const handleSearchByStudentId = (value) => {
    setFilters({
      ...filters,
      student_id: value,
    });
  };

  const handleSearchByEmployeeId = (value) => {
    const params = { ...filters, employee_id: value };
    console.log("params: ", params);

    setFilters(params);
  };

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
        await dispatch(deleteSalary(id));
        getData();
      },
      onCancel: () => {},
    });
  };

  //   useEffect(() => {
  //     getData(filters);
  //     getProfile()
  //   }, [filters]);

  //   const getSubcategories = async () => {
  //     try {
  //       const response = await dispatch(fetchAllStudents()).unwrap();
  //       console.log("response: ", response);
  //       setSubcategories(
  //         response.data.map((guardian) => {
  //           return {
  //             value: guardian.id,
  //             label: guardian.name,
  //           };
  //         })
  //       );
  //     } catch (error) {
  //       message.error(error?.message || "Failed to fetch data");
  //     }
  //   };

  const calculateSalaryBreakdown = (data) => {
    const gapok = Number(data.base_salary || 0);
    const details = data.details || [];

    const allowances = details
      .filter((d) => d.component?.type === "allowance")
      .reduce((sum, d) => sum + Number(d.amount || 0) * (d.qty || 1), 0);

    const bonuses = details
      .filter((d) => d.component?.type === "bonus")
      .reduce((sum, d) => sum + Number(d.amount || 0) * (d.qty || 1), 0);

    const deductions = details
      .filter((d) => d.component?.type === "deduction")
      .reduce((sum, d) => sum + Number(d.amount || 0) * (d.qty || 1), 0);

    const thp = gapok + allowances + bonuses - deductions;

    return { gapok, allowances, bonuses, deductions, thp };
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

  useEffect(() => {
    getEmployee();
  }, []);

  // Fetch all students once, when the component mounts
  //   useEffect(() => {
  //     getSubcategories();
  //   }, []);

  //   Dummy helper
  const maskAccount = (v) => {
    if (!v) return "-";
    const s = String(v);
    if (s.length <= 6) return s.replace(/\d(?=\d{2})/g, "•");
    return s.slice(0, 4) + "•••" + s.slice(-4);
  };

  const printSlip = (data) => {
    if (!data) return;

    const { gapok, bonuses, deductions, thp } = calculateSalaryBreakdown(data);
    const periodeLabel = data.period?.period_name || "-";
    // const idr = (n) => (n != null ? IDRFormat.format(n) : "-");
    const formatRp = (value) => {
      if (value == null || isNaN(value)) return "Rp 0";
      return "Rp " + Number(value).toLocaleString("id-ID");
    };
    const accountMasked = maskAccount(data.payout_account_no);

    // ambil semua tunjangan (allowance) dari details
    const allowanceRows = (data.details || [])
      .filter((d) => d.component?.type === "allowance")
      .map(
        (d) => `
        <tr>
          <td>${d.component?.name || "Tunjangan"}</td>
          <td>${formatRp(Number(d.amount || 0) * (d.qty || 1))}</td>
        </tr>
      `
      )
      .join("");

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Slip Gaji - ${data.employee?.name} (${periodeLabel})</title>
      <style>
        * { box-sizing: border-box; font-family: Arial, Helvetica, sans-serif; }
        body { padding: 24px; color: #111; }
        .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 16px; }
        .brand h2 { margin: 0 0 4px 0; }
        .meta { font-size: 12px; color:#555; }
        .card { border:1px solid #ddd; border-radius:8px; padding:16px; margin: 8px 0 16px; }
        .row { display:flex; flex-wrap: wrap; }
        .col { width: 50%; padding: 4px 8px; }
        .label { color:#666; font-size: 12px; }
        .value { font-weight: 600; }
        .table { width:100%; border-collapse: collapse; margin-top: 8px; }
        .table th, .table td { border:1px solid #ddd; padding:8px; text-align:left; }
        .table th { background:#f7f7f7; }
        .total { text-align:right; font-weight:700; }
        .footer { margin-top: 24px; font-size:12px; color:#777; }
        @media print {
          @page { size: A4; margin: 12mm; }
          .noprint { display:none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="brand">
          <h2>Yayasan Sopiah</h2>
          <div class="meta">Slip Gaji • ${periodeLabel}</div>
        </div>
        <div class="meta">
          Karyawan: <strong>${data.employee?.name}</strong><br/>
          ID: ${data.id}<br/>
          Jabatan: ${data.employee?.position || "-"}
        </div>
      </div>

      <div class="card">
        <div class="row">
          <div class="col"><div class="label">Periode</div><div class="value">${periodeLabel}</div></div>
          <div class="col"><div class="label">Status</div><div class="value">${
            data.is_paid ? "Paid" : "Unpaid"
          }</div></div>
          <div class="col"><div class="label">Metode</div><div class="value">${(
            data.payout_type || "-"
          ).toUpperCase()}</div></div>
          <div class="col"><div class="label">Provider</div><div class="value">${
            data.payout_provider || "-"
          }</div></div>
          <div class="col"><div class="label">No. Rek/HP</div><div class="value">${accountMasked}</div></div>
          <div class="col"><div class="label">Tanggal Pembayaran</div><div class="value">${
            data.payout_date ? moment(data.payout_date).format("DD MMM YYYY") : "-"
          }</div></div>
        </div>
      </div>

      <table class="table">
        <thead>
          <tr><th>Komponen</th><th>Nominal</th></tr>
        </thead>
        <tbody>
          <tr><td>Gaji Pokok</td><td>${formatRp(gapok)}</td></tr>
          ${allowanceRows}
          <tr><td>Bonus</td><td>${formatRp(bonuses)}</td></tr>
          <tr><td>Potongan</td><td>-${formatRp(deductions)}</td></tr>
          <tr><td class="total">Take Home Pay</td><td class="total">${formatRp(thp)}</td></tr>
        </tbody>
      </table>

      <div class="footer">
        Dicetak pada ${moment().format("DD MMM YYYY HH:mm")} • Dokumen ini otomatis dihasilkan dari sistem.
      </div>

      <div class="noprint" style="margin-top:16px;">
        <button onclick="window.print()">Cetak / Simpan PDF</button>
      </div>
    </body>
    </html>
  `;

    const w = window.open("", "_blank");
    w.document.open();
    w.document.write(html);
    w.document.close();
  };

  return (
    <>
      <LocalizedModal></LocalizedModal>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <h2>Gaji</h2>
          <p>Daftar semua gaji</p>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card>
            <Row gutter={[6, 6]}>
              <Col md={8} xl={8} sm={24}>
                {/* <Input onChange={handleSearchByTitle} name="name" placeholder="Cari Berdasarkan Nama Murid" allowClear/> */}
                <Select
                  // mode="multiple"
                  showSearch
                  allowClear
                  placeholder="Cari Berdasarkan Nama Staff"
                  // optionFilterProp="children"
                  style={{ width: "100%" }}
                  value={filters.student_id || undefined}
                  onChange={handleSearchByEmployeeId}
                  //   filterOption={(input, option) => option?.children?.toLowerCase().includes(input.toLowerCase())}
                >
                  {subcategories.map((emp) => (
                    <Select.Option key={emp.value} value={emp.value}>
                      {emp.label}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              {/* <Col md={8} xl={8} sm={24}> */}
              {/* <div style={{ marginBottom: 4, fontWeight: 500 }}>Jatuh Tempo</div> */}
              {/* <DatePicker.RangePicker
                  style={{ width: "100%" }}
                  format="DD-MM-YYYY"
                  placeholder={["Jatuh Tempo Dari", "Jatuh Tempo Sampai"]}
                  onChange={handleDueDateRangeChange}
                /> */}
              {/* </Col> */}
              {/* <Col md={8} xl={8} sm={24}> */}
              {/* <div style={{ marginBottom: 4, fontWeight: 500 }}>Tanggal Bayar</div> */}
              {/* <DatePicker.RangePicker
                  style={{ width: "100%" }}
                  format="DD-MM-YYYY"
                  placeholder={["Tanggal Bayar Dari", "Tanggal Bayar Sampai"]}
                  onChange={handlePaidAtRangeChange}
                /> */}
              {/* </Col> */}
              <Col md={4} xl={4} sm={24}>
                <Select
                  // mode="multiple"
                  showSearch
                  allowClear
                  placeholder="Cari Berdasarkan Status"
                  // optionFilterProp="children"
                  style={{ width: "100%" }}
                  // value={filters.student_id || undefined}
                  // onChange={handleSearchByStudentId}
                  // filterOption={(input, option) => option?.children?.toLowerCase().includes(input.toLowerCase())}
                >
                  {statusOption.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              {/* <Col md={4} xl={4} sm={24} >
                <Input onChange={() => {}} name="owner" placeholder="Perusahaan"></Input>
              </Col> */}
              <Col md={4} xl={4} sm={24}>
                <Button type="primary" style={{ width: "100%" }}>
                  Cari
                </Button>
              </Col>
              <Col>
                <Button type="primary" icon={<UploadOutlined />} onClick={openUpload}>
                  Upload Gaji (Excel)
                </Button>
              </Col>
            </Row>

            <Table
              className="no-border-last"
              columns={tableColumns}
              scroll={{ x: "max-content" }} // enables horizontal scrolling
              //   dataSource={dataDummy}
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
                pathname: `${strings.navigation.path.detail_salary}`,
              });
            }}
            block
          >
            Tambahkan Gaji
          </Button>
        </Col>
      </Row>

      <Modal
        title="Slip Gaji"
        // open={isSlipOpen}
        visible={isSlipOpen}
        onOk={closeSlip}
        onCancel={closeSlip}
        okText="Tutup"
        cancelButtonProps={{ style: { display: "none" } }}
        footer={[
          <Button key="download" onClick={() => printSlip(slipData)}>
            Unduh Slip (PDF)
          </Button>,
          <Button key="close" type="primary" onClick={closeSlip}>
            Tutup
          </Button>,
        ]}
      >
        {slipData &&
          (() => {
            const { gapok, allowances, bonuses, deductions, thp } = calculateSalaryBreakdown(slipData);
            return (
              <div style={{ lineHeight: 1.9 }}>
                <div>
                  <strong>Nama</strong>: {slipData.employee?.name}
                </div>
                <div>
                  <strong>Jabatan</strong>: {slipData.employee?.position}
                </div>
                <div>
                  <strong>Gaji Pokok</strong>: {IDRFormat.format(gapok)}
                </div>
                <div>
                  <strong>Tunjangan</strong>: {IDRFormat.format(allowances)}
                </div>
                <div>
                  <strong>Bonus</strong>: {IDRFormat.format(bonuses)}
                </div>
                <div>
                  <strong>Potongan</strong>: -{IDRFormat.format(deductions)}
                </div>
                <div>
                  <strong>Take Home Pay</strong>: {IDRFormat.format(thp)}
                </div>
              </div>
            );
          })()}
      </Modal>

      {contextHolder}
    </>
  );
};

export default withRouter(SALARY);
