import { Col, Row, message, Typography, Divider, Tabs, DatePicker, InputNumber } from "antd";
import React, { useEffect, useState } from "react";
import { Button, Card, Form, Input } from "antd";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Select } from "antd";
import { fetchAllWajib } from 'redux/features/wajib_pajak';
import { fetchAllTags } from "redux/features/tags";
import { getUserProfile } from "redux/features/auth";

import { MyEditor } from "../../../components/Editor";
import moment from "moment";
import { fetchAllStudents } from "redux/features/students";
import { fetchOneBill, updateBill, addBill } from "redux/features/bill";

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

const statusOptions = [
  { label: "Sudah Bayar", value: true },
  { label: "Belum Bayar", value: false},
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




export const DETAIL_BILL = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();
  const location = useLocation();
  const [perusahaan, setPerusahaan] = useState("");
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [tags, setTags] = useState();
  const [role, setRole] = useState('');

  const onFinish = (values) => {
    console.log('values: ', values);
    console.log('location: ', location);
    if (location?.state?.id) {
      updateData({
        ...values,
        id: location.state.id,
        amount: Number(values.amount),
      });
    } else {
        console.log('values: ', values);
      createData(
        {
          ...values,
          amount: Number(values.amount),
        }
      );
    }
  };

  const getProfile = async () => {
    try {
      const response = await dispatch(getUserProfile()).unwrap();
      setRole(response.data.user.role_id)
      setPerusahaan(response.data.user.perusahaan)
    } catch (error) {
      setLoading(false);
      message.error(error?.message || "Failed to fetch data");
    }
  };

  const getAllCompanies = async () => {
    try {
      const { data } = await dispatch(fetchAllWajib({ limit: 1000 })).unwrap();
      const list_pt = data.data.map(item => ({
        value: item.perusahaan,
        label: item.perusahaan
      }));

      setCompanies(list_pt);
    } catch (err) {
      console.log(err)
    }
  }

  const [markerLocation, setMarkerLocation] = useState({
    latitude: null,
    longitude: null,
  });

  // Function to handle marker location change from MapboxMap
  const handleLocationChange = (latitude, longitude) => {
    setMarkerLocation({ latitude, longitude });
  };

  const createData = async (values) => {
    try {
      await dispatch(addBill({
        ...values,
        // name: values.name.toUpperCase(),
        // latitude: markerLocation.latitude ? markerLocation.latitude?.toString() : "-2.990934",
        // longitude: markerLocation.longitude ? markerLocation.longitude?.toString() : "104.756554",
        // sdg: values.sdg || "LAINNYA",
        // opd: values.opd || "LAINNYA",
        // kecamatan: values.kecamatan ? values.kecamatan : "SUMATERA SELATAN",
        // kelurahan: values.kelurahan ? values.kelurahan : "SUMATERA SELATAN",
        // koordinat: values.koordinat ? values.koordinat : "SUMATERA SELATAN",
        // kabupaten: values.kabupaten ? values.kabupaten : "SUMATERA SELATAN",
        // endDate: values.deadline,
        // sgd: values.sdg || "LAINNYA",
        // kategori: values.kategori || "LAINNYA",
        // pic_id: 1,
        // vendor_id: 1,
        // file: '-',
        // owner: role === 1 ? values.perusahaan : perusahaan,
        // perusahaan: role === 1 ? values.perusahaan : perusahaan,
        // status: "OPEN",
        // verification: "WAITING",
        // cost: parseInt(values.cost || 0),
        // actual: parseInt(values.actual || 0),
        // diskon_pajak: parseInt(values.diskon_pajak || 0),
        // bast: bast,
        // proposal: values.proposal || "-",
        // certificate: values.certificate ? values.certificate : "-",
        // laporan: values.laporan || "-",
        // description: values.description || "-",
        // nilai_sroi: parseInt(values.nilai_sroi) || 0,
        // kebutuhan: kebutuhan,
      })).unwrap();
    //   if (role === 1) {
        // history.push("/app/student-bills");
        // } else {
        history.push("/app/student-billsr");
        // }

    } catch (error) {
      message.error(error.message || "Ada yang salah dengan data anda! Pastikan semua nilai terisi, jika tidak ada isikan dengan nilai '-'");
    }
  };

  const getTags = async () => {
    try {
      const response = await dispatch(fetchAllTags()).unwrap();
      setTags(
        response.data.map((tag) => {
          return {
            value: tag.id,
            label: tag.name,
          };
        })
      );
    } catch (error) {
      message.error(error?.message || "Failed to fetch data");
    }
  };

  const updateData = async (values) => {
    try {
      await dispatch(updateBill({
        ...values,
        // name: values.name.toUpperCase(),
        // id: location?.state?.id,
        // latitude: markerLocation.latitude ? markerLocation.latitude?.toString() : "-2.990934",
        // longitude: markerLocation.longitude ? markerLocation.longitude?.toString() : "104.756554",
        // pic_id: 1,
        // vendor_id: 1,
        // sdg: values.sdg || "LAINNYA",
        // status: role === 1 || role === 6 ? values.status : "OPEN",
        // verification: role === 1 || role === 5 ? values.verification : "VERIFIED",
        // opd: values.opd || "LAINNYA",
        // file: '-',
        // diskon_pajak: parseInt(values.diskon_pajak || 0),
        // kecamatan: values.kecamatan ? values.kecamatan : "SUMATERA SELATAN",
        // kelurahan: values.kelurahan ? values.kelurahan : "SUMATERA SELATAN",
        // koordinat: values.koordinat ? values.koordinat : "SUMATERA SELATAN",
        // kabupaten: values.kabupaten ? values.kabupaten : "SUMATERA SELATAN",
        // endDate: values.deadline,
        // sgd: values.sdg || "LAINNYA",
        // kategori: values.kategori || "LAINNYA",
        // perusahaan: (role === 1 || role === 4) ? values.perusahaan : perusahaan,
        // owner: (role === 1 || role === 4) ? values.perusahaan : perusahaan,
        // cost: parseInt(values.cost || 0),
        // actual: parseInt(values.actual || 0),
        // bast: bast,
        // laporan: laporan,
        // proposal: values.proposal || "-",
        // certificate: values.certificate || "-",
        // description: values.description || "-",
        // nilai_sroi: (role === 1 || role === 6) ? parseInt(values.nilai_sroi) : 0,
        // nilai_diskon_pajak: (role === 1 || role === 6) ? parseInt(values.nilai_diskon_pajak) : 0,
        // kebutuhan: kebutuhan,
      })).unwrap();
    //   if (role === 3) {
    //     history.push("/app/projects-opd");
    //   } else if (role === 1) {
    //     history.push("/app/projects");
    //   } else {
        history.push("/app/student-bills");
    //   }
    } catch (error) {
      message.error(error?.message || "Failed to fetch data");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const getDataById = async (id) => {
    try {
      const res = await dispatch(fetchOneBill(id)).unwrap();
      const student = res.data
      form.setFieldsValue({
         name: student.student_id,
         title: student.title,
         description: student.description,
         amount: student.amount,
         due_date: student.due_date ? moment(student.due_date) : null,
         is_paid: student.is_paid ? true : false,
         paid_at: student.paid_at ? moment(student.paid_at) : null,
         payment_method: student.payment_method,
         payment_link: student.payment_link,
      });
    } catch (err) {
      console.log(err);
    }
  };

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
    if (location?.state?.id) {
        console.log('id: ', location?.state?.id);
      getDataById(location?.state?.id);

    }
  }, []);

  useEffect(()=> {
    getSubcategories()
  },[])

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
          <Card>
            <Form
              name="basic"
              form={form}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              labelAlign="right"
              {...layout}
            >
              <Typography.Title level={5}>Tagihan</Typography.Title>
              <Form.Item
                 label="Nama"
                 name="name"
               >
                 <Select
                     placeholder="Pilih Murid"
                     options={subcategories}
                 />
               </Form.Item>

              <Form.Item
                label="Judul"
                name="title"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Deskripsi"
                name="description"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Jumlah"
                name="amount"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Jatuh Tempo"
                name="due_date"
              >
                {/* <Input /> */}
                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label="Status"
                name="is_paid"
              >
                <Select placeholder="Pilih Gender" options={statusOptions} />
              </Form.Item>

              <Form.Item
                label="Tanggal bayar"
                name="paid_at"
              >
                {/* <Input /> */}
                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label="Metode Pembayaran"
                name="payment_method"
              >
                <Select placeholder="Pilih Gender" options={paymentMethodOptions} />
              </Form.Item>

              <Form.Item
                label="Link Pembayaran"
                name="payment_link"
              >
                <Input />
              </Form.Item>

              <Form.Item wrapperCol={24}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DETAIL_BILL;
