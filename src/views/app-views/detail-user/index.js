import { Col, Row, Select, message } from 'antd';
import React, { useEffect, useState } from "react";
import { Button, Card, Form, Input, InputNumber } from 'antd';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { addUser, fetchOneUser, updateUser } from 'redux/features/user';
import { fetchAllWajib } from 'redux/features/wajib_pajak';
import Password from 'antd/lib/input/Password';

const kabupatens = [
  { "label": "SUMATERA SELATAN", "value": "SUMATERA SELATAN" },
  { "label": "BANYUASIN", "value": "BANYUASIN" },
  { "label": "EMPAT LAWANG", "value": "EMPAT LAWANG" },
  { "label": "LAHAT", "value": "LAHAT" },
  { "label": "MUARA ENIM", "value": "MUARA ENIM" },
  { "label": "MUSI BANYUASIN", "value": "MUSI BANYUASIN" },
  { "label": "MUSI RAWAS", "value": "MUSI RAWAS" },
  { "label": "MUSI RAWAS UTARA", "value": "MUSI RAWAS UTARA" },
  { "label": "OGAN ILIR", "value": "OGAN ILIR" },
  { "label": "OGAN KOMERING ILIR", "value": "OGAN KOMERING ILIR" },
  { "label": "OGAN KOMERING ULU", "value": "OGAN KOMERING ULU" },
  { "label": "OGAN KOMERING ULU SELATAN", "value": "OGAN KOMERING ULU SELATAN" },
  { "label": "OGAN KOMERING ULU TIMUR", "value": "OGAN KOMERING ULU TIMUR" },
  { "label": "PENUKAL ABAB LEMATANG ILIR", "value": "PENUKAL ABAB LEMATANG ILIR" },
  { "label": "LUBUKLINGGAU", "value": "LUBUKLINGGAU" },
  { "label": "PAGAR ALAM", "value": "PAGAR ALAM" },
  { "label": "PALEMBANG", "value": "PALEMBANG" },
  { "label": "PRABUMULIH", "value": "PRABUMULIH" },
  { "label": "LAINNYA", "value": "LAINNYA" },
]

// const opds = [
//   { "label": "DINAS PENDIDIKAN", "value": "DINAS PENDIDIKAN" },
//   { "label": "DINAS KESEHATAN", "value": "DINAS KESEHATAN" },
//   { "label": "DINAS PEKERJAAN UMUM DAN PENATAAN RUANG", "value": "DINAS PEKERJAAN UMUM DAN PENATAAN RUANG" },
//   { "label": "DINAS PERHUBUNGAN", "value": "DINAS PERHUBUNGAN" },
//   { "label": "DINAS SOSIAL", "value": "DINAS SOSIAL" },
//   { "label": "DINAS PERTANIAN", "value": "DINAS PERTANIAN" },
//   { "label": "DINAS KETAHANAN PANGAN", "value": "DINAS KETAHANAN PANGAN" },
//   { "label": "DINAS LINGKUNGAN HIDUP", "value": "DINAS LINGKUNGAN HIDUP" },
//   { "label": "DINAS PARIWISATA", "value": "DINAS PARIWISATA" },
//   { "label": "DINAS PERDAGANGAN", "value": "DINAS PERDAGANGAN" },
//   { "label": "DINAS PERINDUSTRIAN", "value": "DINAS PERINDUSTRIAN" },
//   { "label": "DINAS KOMUNIKASI DAN INFORMATIKA", "value": "DINAS KOMUNIKASI DAN INFORMATIKA" },
//   { "label": "DINAS KEPENDUDUKAN DAN PENCATATAN SIPIL", "value": "DINAS KEPENDUDUKAN DAN PENCATATAN SIPIL" },
//   { "label": "DINAS PEMUDA DAN OLAHRAGA", "value": "DINAS PEMUDA DAN OLAHRAGA" },
//   { "label": "DINAS PERPUSTAKAAN DAN KEARSIPAN", "value": "DINAS PERPUSTAKAAN DAN KEARSIPAN" },
//   { "label": "DINAS PEMBERDAYAAN PEREMPUAN DAN PERLINDUNGAN ANAK", "value": "DINAS PEMBERDAYAAN PEREMPUAN DAN PERLINDUNGAN ANAK" },
//   { "label": "DINAS PEMBERDAYAAN MASYARAKAT DAN DESA", "value": "DINAS PEMBERDAYAAN MASYARAKAT DAN DESA" },
//   { "label": "DINAS KOPERASI DAN UMKM", "value": "DINAS KOPERASI DAN UMKM" },
//   { "label": "BADAN PERENCANAAN PEMBANGUNAN DAERAH", "value": "BADAN PERENCANAAN PEMBANGUNAN DAERAH" },
//   { "label": "BADAN PENGELOLAAN KEUANGAN DAERAH", "value": "BADAN PENGELOLAAN KEUANGAN DAERAH" },
//   { "label": "BADAN KEPEGAWAIAN DAERAH", "value": "BADAN KEPEGAWAIAN DAERAH" },
//   { "label": "BADAN PENGAWASAN PEMBANGUNAN DAERAH", "value": "BADAN PENGAWASAN PEMBANGUNAN DAERAH" },
//   { "label": "BADAN PENDAPATAN DAERAH", "value": "BADAN PENDAPATAN DAERAH" },
//   { "label": "SEKRETARIAT DAERAH", "value": "SEKRETARIAT DAERAH" },
//   { "label": "SEKRETARIAT DPRD", "value": "SEKRETARIAT DPRD" },
//   { "label": "INSPEKTORAT DAERAH", "value": "INSPEKTORAT DAERAH" },
//   { "label": "LAINNYA", "value": "LAINNYA" },
// ]

const opds =
  [
    { "label": "BADAN PENANGGULANGAN BENCANA DAERAH PROVINSI SUMATERA SELATAN", "value": "BADAN PENANGGULANGAN BENCANA DAERAH PROVINSI SUMATERA SELATAN" },
    { "label": "DINAS PERUMAHAN DAN KAWASAN PERMUKIMAN PROVINSI SUMATERA SELATAN", "value": "DINAS PERUMAHAN DAN KAWASAN PERMUKIMAN PROVINSI SUMATERA SELATAN" },
    { "label": "DINAS PENGELOLAAN SUMBER DAYA AIR PROVINSI SUMATERA SELATAN", "value": "DINAS PENGELOLAAN SUMBER DAYA AIR PROVINSI SUMATERA SELATAN" },
    { "label": "DINAS PEKERJAAN UMUM BINA MARGA DAN TATA RUANG PROVINSI SUMATERA SELATAN", "value": "DINAS PEKERJAAN UMUM BINA MARGA DAN TATA RUANG PROVINSI SUMATERA SELATAN" },
    { "label": "DINAS KESEHATAN PROVINSI SUMATERA SELATAN", "value": "DINAS KESEHATAN PROVINSI SUMATERA SELATAN" },
    { "label": "DINAS PENDIDIKAN PROVINSI SUMATERA SELATAN", "value": "DINAS PENDIDIKAN PROVINSI SUMATERA SELATAN" },
    { "label": "DINAS PERTANIAN TANAMAN PANGAN DAN HORTIKULTURA PROVINSI SUMATERA SELATAN", "value": "DINAS PERTANIAN TANAMAN PANGAN DAN HORTIKULTURA PROVINSI SUMATERA SELATAN" },
    { "label": "DINAS SOSIAL PROVINSI SUMATERA SELATAN", "value": "DINAS SOSIAL PROVINSI SUMATERA SELATAN" },
    { "label": "DINAS KOPERASI DAN UMKM PROVINSI SUMATERA SELATAN", "value": "DINAS KOPERASI DAN UMKM PROVINSI SUMATERA SELATAN" },
    { "label": "DINAS PERINDUSTRIAN PROVINSI SUMATERA SELATAN", "value": "DINAS PERINDUSTRIAN PROVINSI SUMATERA SELATAN" },
    { "label": "DINAS PERDAGANGAN PROVINSI SUMATERA SELATAN", "value": "DINAS PERDAGANGAN PROVINSI SUMATERA SELATAN" },
    { "label": "DINAS PENANAMAN MODAL TERPADU SATU PINTU PROVINSI SUMATERA SELATAN", "value": "DINAS PENANAMAN MODAL TERPADU SATU PINTU PROVINSI SUMATERA SELATAN" },
    { "label": "DINAS ENERGI DAN SUMBER DAYA MINERAL PROVINSI SUMATERA SELATAN", "value": "DINAS ENERGI DAN SUMBER DAYA MINERAL PROVINSI SUMATERA SELATAN" },
    { "label": "DINAS LINGKUNGAN HIDUP DAN PERTANAHAN PROVINSI SUMATERA SELATAN", "value": "DINAS LINGKUNGAN HIDUP DAN PERTANAHAN PROVINSI SUMATERA SELATAN" },
    { "label": "DINAS KOMUNIKASI DAN INFORMATIKA PROVINSI SUMATERA SELATAN", "value": "DINAS KOMUNIKASI DAN INFORMATIKA PROVINSI SUMATERA SELATAN" },
    { "label": "BIRO PEREKONOMIAN SETDA PROVINSI SUMATERA SELATAN", "value": "BIRO PEREKONOMIAN SETDA PROVINSI SUMATERA SELATAN" },
    { "label": "BIRO KESEJAHTERAAN RAKYAT SETDA PROVINSI SUMATERA SELATAN", "value": "BIRO KESEJAHTERAAN RAKYAT SETDA PROVINSI SUMATERA SELATAN" },
    { "label": "BAPPEDA KOTA PALEMBANG", "value": "BAPPEDA KOTA PALEMBANG" },
    { "label": "BAPPEDA KOTA PAGAR ALAM", "value": "BAPPEDA KOTA PAGAR ALAM" },
    { "label": "BAPPEDA KOTA LUBUK LINGGAU", "value": "BAPPEDA KOTA LUBUK LINGGAU" },
    { "label": "BAPPEDA KOTA PRABUMULIH", "value": "BAPPEDA KOTA PRABUMULIH" },
    { "label": "BAPPEDA KABUPATEN OGAN ILIR", "value": "BAPPEDA KABUPATEN OGAN ILIR" },
    { "label": "BAPPEDA KABUPATEN MUSI BANYUASIN", "value": "BAPPEDA KABUPATEN MUSI BANYUASIN" },
    { "label": "BAPPEDA KABUPATEN BANYUASIN", "value": "BAPPEDA KABUPATEN BANYUASIN" },
    { "label": "BAPPEDA KABUPATEN OGAN KOMERING ILIR", "value": "BAPPEDA KABUPATEN OGAN KOMERING ILIR" },
    { "label": "BAPPEDA KABUPATEN OKU", "value": "BAPPEDA KABUPATEN OKU" },
    { "label": "BAPPEDA KABUPATEN OKU TIMUR", "value": "BAPPEDA KABUPATEN OKU TIMUR" },
    { "label": "BAPPEDA KABUPATEN OKU SELATAN", "value": "BAPPEDA KABUPATEN OKU SELATAN" },
    { "label": "BAPPEDA KABUPATEN MUARA ENIM", "value": "BAPPEDA KABUPATEN MUARA ENIM" },
    { "label": "BAPPEDA KABUPATEN PALI", "value": "BAPPEDA KABUPATEN PALI" },
    { "label": "BAPPEDA KABUPATEN MUSI RAWAS", "value": "BAPPEDA KABUPATEN MUSI RAWAS" },
    { "label": "BAPPEDA KABUPATEN MUSI RAWAS UTARA", "value": "BAPPEDA KABUPATEN MUSI RAWAS UTARA" },
    { "label": "BAPPEDA KABUPATEN EMPAT LAWANG", "value": "BAPPEDA KABUPATEN EMPAT LAWANG" },
    { "label": "BAPPEDA KABUPATEN LAHAT", "value": "BAPPEDA KABUPATEN LAHAT" },
    { "label": "PERANGKAT DAERAH BADAN PENELITIAN DAN PENGEMBANGAN DAERAH", "value": "PERANGKAT DAERAH BADAN PENELITIAN DAN PENGEMBANGAN DAERAH" },
    { "label": "LAINNYA", "value": "LAINNYA" }
  ]

export const USER = () => {

  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();
  const location = useLocation()

  const [companies, setCompanies] = useState([])
  const [role, setRole] = useState("user")
  const [tipe, setTipe] = useState("user")

  const handleChange = (value) => {
    setRole(value)
  };

  const onFinish = (values) => {
    if (location?.state?.id) {
      updateData(values)
    } else {
      createData(values)
    }
  }

  const role_map = {
    admin: "1",
    perusahaan: "2",
    opd: "3",
    penerima: "4",
    petugas: "5",
    verificator: "6"
  }

  const createData = async (values) => {
    try {
      console.log(values)
      await dispatch(addUser({
        ...values,
        role_id: values.role_id
      })).unwrap()
      history.push("/app/users")
    } catch (error) {
      message.error(error?.message || 'Failed to register')
    }
  }

  const updateData = async (values) => {
    try {
      await dispatch(updateUser({ ...values, role_id: values.role_id, id: location?.state?.id })).unwrap()
      history.push("/app/users")
    } catch (error) {
      message.error(error?.message || 'Failed to fetch data')
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const getDataById = async (id) => {
    try {
      const data = await dispatch(fetchOneUser(id)).unwrap()
      form.setFieldsValue({
        ...data.data
      });
    } catch (err) {
      console.log(err)
    }
  }

  const getAllCompanies = async () => {
    try {
      const { data } = await dispatch(fetchAllWajib({ limit: 100 })).unwrap();
      const list_pt = data.data.map(item => ({
        value: item.perusahaan,
        label: item.perusahaan
      }));

      setCompanies(list_pt);
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getAllCompanies()
    if (location?.state?.id) {
      getDataById(location?.state?.id)
    }
  }, [])

  return (
    <>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <h2>Tambah/Update Data Pengguna</h2>
          <p>Tolong isikan data sesuai dengan data pengguna</p>
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
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  {
                    required: true,
                    message: 'Please input your username!',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Please input your email!',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="No HP"
                name="no_phone"
              >
                <Input />
              </Form.Item>

              <p style={{ color: "black", fontWeight: "bold" }}>(1.Admin ; 2.Perusahaan ; 3.OPD ; 4.Petugas ; 5.Verifikator; 6. Sertifikator)</p>
              <Form.Item
                label="Role"
                name="role_id"
              >
                <Select placeholder="Select Role Number" options={[{ value: 1, label: 1 }, { value: 2, label: 2 }, { value: 3, label: 3 }, { value: 4, label: 4 }, { value: 5, label: 5 }, { value: 6, label: 6 }]} />
              </Form.Item>

              <Form.Item
                label="Kabupaten"
                name="regency"
                rules={[
                  {
                    required: true,
                    message: 'Please select city!',
                  },
                ]}
              >
                <Select options={kabupatens} />
              </Form.Item>

              {/* <Form.Item
                label="OPD"
                name="opd"

              >
                <Select options={opds} />
              </Form.Item> */}

              <Form.Item
                label="Instansi"
                name="perusahaan"
                rules={[
                  {
                    required: true,
                    message: 'Please input your company!',
                  },
                ]}
              >
                <Select options={companies} />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please input password!',
                  },
                ]}
              >
                <Password />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default USER