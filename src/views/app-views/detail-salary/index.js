import { Col, Row, message, Typography, Divider, Tabs, Space, DatePicker, InputNumber } from "antd";
import React, { useEffect, useState } from "react";
import { Button, Card, Form, Input } from "antd";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Select } from "antd";
import { fetchAllWajib } from "redux/features/wajib_pajak";
import { fetchAllTags } from "redux/features/tags";
import { getUserProfile } from "redux/features/auth";

import { MyEditor } from "../../../components/Editor";
import moment from "moment";
import { fetchAllStudents } from "redux/features/students";
import { fetchOneBill, updateBill, addBill } from "redux/features/bill";
import { addSalary, fetchOneSalary, updateSalary } from "redux/features/salary";
import { fetchAllEmployees } from "redux/features/employee";
import { fetchAllSalaryComponents } from "redux/features/salaryComponent";

const selectStyle = {
  width: "100%",
  backgroundColor: "white",
};

const rules = [
  {
    required: true,
    message: "WAJIB DIISI!",
  },
];

const genderOptions = [
  { label: "Laki-laki", value: "L" },
  { label: "Perempuan", value: "P" },
];

const paymentMethodOptions = [
  { label: "Transfer", value: "transfer" },
  { label: "Cash", value: "cash" },
];

const statusOption = [
  //   {
  //     value: "Draft",
  //     label: "Draft",
  //   },
  //   {
  //     value: "Approved",
  //     label: "Approved",
  //   },
  {
    value: true,
    label: "Paid",
  },
  {
    value: false,
    label: "Unpaid",
  },
];

const dummyGuardians = [
  {
    id: 1,
    name: "Siti Aminah",
    phone: "+628987654321",
    address: "Jl. Melati No. 45, Bandung",
    user_id: 3,
    students: [],
  },
  {
    id: 2,
    name: "Ahmad Zainal",
    phone: "+6281234567890",
    address: "Jl. Raya No. 123, Jakarta",
    user_id: 2,
    students: [],
  },
];

export const DETAIL_SALARY = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();
  const location = useLocation();
  const [perusahaan, setPerusahaan] = useState("");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [tags, setTags] = useState();
  const [role, setRole] = useState("");
  const [employees, setEmployees] = useState([]);
  const [components, setComponents] = useState([]);

  const onFinish = (values) => {
    console.log("Raw form values:", values);

    const details = [
      { component_id: 1, amount: Number(values.base_salary || 0), qty: 1 },
      values.t_makan ? { component_id: 2, amount: Number(values.t_makan), qty: 1 } : null,
      values.t_transport ? { component_id: 3, amount: Number(values.t_transport), qty: 1 } : null,
      values.t_komunikasi ? { component_id: 4, amount: Number(values.t_komunikasi), qty: 1 } : null,
      values.bonus ? { component_id: 10, amount: Number(values.bonus), qty: 1 } : null,
      values.potongan ? { component_id: 11, amount: Number(values.potongan), qty: 1 } : null,
    ].filter(Boolean);

    const payload = {
      employee_id: values.employee_id,
      period_name: values.period_name,
      period: values.period ? values.period.format("YYYY-MM-DD") : null,
      base_salary: Number(values.base_salary || 0),
      nomor_rekening: values.nomor_rekening,
      note: values.note || "",
      is_paid: values.is_paid || false,
      details,
    };

    console.log("Formatted payload:", payload);

    if (location?.state?.id) {
      updateData({ ...payload, id: location.state.id });
    } else {
      createData(payload);
    }
  };

  const createData = async (values) => {
    try {
      await dispatch(addSalary(values)).unwrap();
      message.success("Gaji berhasil ditambahkan!");
      history.push("/app/salaries");
    } catch (error) {
      if (error?.errors) {
        // tampilkan detail error
        message.error(Object.values(error.errors).flat().join(", ") || error.errors.message || "Terjadi kesalahan");
      } else {
        message.error(error?.message || "Terjadi kesalahan");
      }
    }
  };

  const updateData = async (values) => {
    try {
      await dispatch(updateSalary(values)).unwrap();
      message.success("Gaji berhasil diperbarui!");
      history.push("/app/salaries");
    } catch (error) {
      if (error?.errors) {
        // tampilkan detail error
        message.error(Object.values(error.errors).flat().join(", ") || error.errors.message || "Terjadi kesalahan");
      } else {
        message.error(error?.message || "Terjadi kesalahan");
      }
    }
  };

  const getSalaryComponents = async () => {
    try {
      const res = await dispatch(fetchAllSalaryComponents()).unwrap();
      setComponents(res.data);
    } catch (err) {
      message.error(err?.message || "Gagal ambil komponen gaji");
    }
  };

  const getDataById = async (id) => {
    setLoading(true);
    try {
      const res = await dispatch(fetchOneSalary(id)).unwrap();
      const salary = res.data;

      const findAmount = (compId) => {
        const item = salary.details?.find((d) => d.component_id === compId);
        return item ? Number(item.amount) : null;
      };

      form.setFieldsValue({
        employee_id: salary.employee_id,
        period_name: salary.period?.period_name,
        period: salary.period?.period ? moment(salary.period.period) : null,
        base_salary: Number(salary.base_salary) || 0,
        t_makan: findAmount(2),
        t_transport: findAmount(3),
        t_komunikasi: findAmount(4),
        bonus: findAmount(10),
        potongan: findAmount(11),
        nomor_rekening: salary.nomor_rekening,
        note: salary.note,
        is_paid: salary.is_paid,
      });
    } catch (err) {
      console.error("Error getDataById:", err);
      message.error("Gagal mengambil detail gaji");
    } finally {
      setLoading(false);
    }
  };

  const getEmployees = async () => {
    try {
      const res = await dispatch(fetchAllEmployees()).unwrap();
      setEmployees(
        res.data.map((e) => ({
          value: e.id,
          label: `${e.name} - ${e.position}`,
        }))
      );
    } catch (err) {
      message.error("Gagal mengambil data pegawai");
    }
  };

  useEffect(() => {
    getEmployees();
  }, []);

  useEffect(() => {
    getSalaryComponents();
  }, []);

  useEffect(() => {
    if (location?.state?.id) {
      console.log("id: ", location?.state?.id);
      getDataById(location?.state?.id);
    }
  }, []);

  const layout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
      md: { span: 6 },
      lg: { span: 5 },
      xl: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
      md: { span: 18 },
      lg: { span: 19 },
      xl: { span: 20 },
    },
  };

  const guardianOptions = subcategories.map((guardian) => ({
    value: guardian.id,
    label: guardian.name,
  }));

  return (
    <>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          {/* <h2>Tambah/Update Proyek Baru {perusahaan} Kode {role}</h2> */}
          <h2>Tambah/Update tagihan</h2>
          {/* <p>Tolong isi proyek baru di form ini sesuai dengan data</p> */}
          <p>Tolong isi tagihan baru di form ini sesuai dengan data</p>
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card loading={loading}>
            <Typography.Title level={4}>Tambah Gaji</Typography.Title>
            <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
              <Form.Item label="Pegawai" name="employee_id" rules={[{ required: true }]}>
                <Select options={employees} placeholder="Pilih pegawai" />
              </Form.Item>

              <Form.Item label="Nama Periode" name="period_name" rules={[{ required: true }]}>
                <Input placeholder="Contoh: Agustus 2025" />
              </Form.Item>

              <Form.Item label="Tanggal Periode" name="period" rules={[{ required: true }]}>
                <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item label="Gaji Pokok" name="base_salary" rules={[{ required: true }]}>
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item label="Tunjangan Makan" name="t_makan">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item label="Tunjangan Transport" name="t_transport">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item label="Tunjangan Komunikasi" name="t_komunikasi">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item label="Bonus" name="bonus">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item label="Potongan" name="potongan">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item label="Nomor Rekening" name="nomor_rekening">
                <Input />
              </Form.Item>

              <Form.Item label="Catatan" name="note">
                <Input.TextArea />
              </Form.Item>

              <Form.Item label="Status" name="is_paid">
                <Select options={statusOption} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                  Simpan
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DETAIL_SALARY;
