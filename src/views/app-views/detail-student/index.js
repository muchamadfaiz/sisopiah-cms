import { Col, Row, message, Typography, Divider, Tabs, DatePicker, InputNumber } from "antd";
import React, { useEffect, useState } from "react";
import { Button, Card, Form, Input } from "antd";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Select } from "antd";
import { fetchAllSubcategory } from "redux/features/subcategory";
import { fetchAllWajib } from 'redux/features/wajib_pajak';
import { fetchAllTags } from "redux/features/tags";
import { getUserProfile } from "redux/features/auth";
import { kabupatens, opds, categories, sdgs } from '../../../constants/DataConstant'
import Map from "../../../components/EditableMap";
import {
  addProject,
  fetchOneProject,
  updateProject,
} from "redux/features/projects";
import { MyEditor } from "../../../components/Editor";
import moment from "moment";
import { addStudent, fetchOneStudent, updateStudent } from "redux/features/students";
import { fetchAllGuardians } from "redux/features/guardians";

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

const relasiOptions = [
  { label: "Ayah", value: "ayah" },
  { label: "Ibu", value: "ibu" },
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




export const DETAIL_STUDENT = () => {
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
        guardians: [
        {
            guardian_id: values.guardian,
            relation: "Ayah", 
        },
    ],
      });
    } else {
        console.log('values: ', values);
      createData(
        {
          ...values,
          guardians: [
            {
              guardian_id: values.guardian,
              relation: values.relation ? values.relation : "takada",
            },
          ],
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
      await dispatch(addStudent({
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
      if (role === 1) {
        history.push("/app/my-projects");
        } else {
        history.push("/app/my-dapur");
        }

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
      await dispatch(updateStudent({
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
        history.push("/app/student");
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
      const res = await dispatch(fetchOneStudent(id)).unwrap();
      const student = res.data
      form.setFieldsValue({
        ...student,
        // birth_date: moment(student.birth_date).format("YYYY-MM-DD") || "-",
        birth_date: student.birth_date ? moment(student.birth_date) : null,
        guardian: student.guardians?.[0]?.guardian?.id || "-",
        relation:student.guardians?.[0]?.relation || "-",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getSubcategories = async () => {
    try {
      const response = await dispatch(fetchAllGuardians()).unwrap();
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
    <p>{subcategories.map((item) => <p>{item.label}</p>)}</p>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          {/* <h2>Tambah/Update Proyek Baru {perusahaan} Kode {role}</h2> */}
          <h2>Tambah/Update murid baru</h2>
          {/* <p>Tolong isi proyek baru di form ini sesuai dengan data</p> */}
          <p>Tolong isi murid baru di form ini sesuai dengan data</p>
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
                <Typography.Title level={5}>Profil Murid</Typography.Title>
              <Form.Item
                label="Nama Murid"
                name="name"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="NIS"
                name="nis"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: 'Please select a gender!' }]}
              >
                <Select placeholder="Pilih Gender" options={genderOptions} />
              </Form.Item>

              <Form.Item
                label="Tanggal Lahir"
                name="birth_date"
              >
                {/* <Input /> */}
                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label="Kelas"
                name="class"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Alamat"
                name="address"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Wali Murid"
                name="guardian"
              >
                <Select
                    placeholder="Pilih Wali Murid"
                    options={subcategories}
                />
              </Form.Item>

               <Form.Item
                label="Relasi"
                name="relation"
              >
                <Select placeholder="Pilih Relasi" options={relasiOptions} />
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

export default DETAIL_STUDENT;
