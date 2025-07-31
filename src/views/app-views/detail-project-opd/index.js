import { Col, Row, message, Tabs, DatePicker } from "antd";
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

export const DETAIL_PROJECT = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();
  const location = useLocation();
  const [idBody, setIdBody] = useState("");
  const [perusahaan, setPerusahaan] = useState("");
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState("");
  const [kebutuhan, setKebutuhan] = useState("");
  const [laporan, setLaporan] = useState("");
  const [bast, setBast] = useState("");
  const [subcategories, setSubcategories] = useState();
  const [tags, setTags] = useState();
  const [role, setRole] = useState('');

  const [kabupaten, setKabupaten] = useState("");
  const [opd, setOpd] = useState("");
  const [kategori, setKategori] = useState("");
  const [sdg, setSdg] = useState("");

  const onFinish = (values) => {
    if (location?.state?.id) {
      updateData({
        ...values,
        id: location.state.id,
      });
    } else {
      createData(values);
    }
  };

  const getProfile = async () => {
    try {
      const response = await dispatch(getUserProfile()).unwrap();
      setRole(response.data.user.role_id)
      setPerusahaan(response.data.user.perusahaan)
      setOpd(response.data.user.opd)
      setKabupaten(response.data.user.kabupaten)
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
      await dispatch(addProject({
        ...values,
        name:values.name.toUpperCase(),
        latitude: markerLocation.latitude ? markerLocation.latitude?.toString() : "-2.990934",
        longitude: markerLocation.longitude ? markerLocation.longitude?.toString() : "104.756554",
        sdg: values.sdg || "LAINNYA",
        opd: opd,
        kecamatan: values.kecamatan ? values.kecamatan : "SUMATERA SELATAN",
        kelurahan: values.kelurahan ? values.kelurahan : "SUMATERA SELATAN",
        koordinat: values.koordinat ? values.koordinat : "SUMATERA SELATAN",
        kabupaten: kabupaten,
        endDate: values.deadline,
        diskon_pajak: parseInt(values.diskon_pajak || 0),
        sgd: values.sdg || "LAINNYA",
        kategori: values.kategori || "LAINNYA",
        pic_id: 1,
        vendor_id: 1,
        file: '-',
        description: values.description ? values.description : '-',
        perusahaan: "BELUM ADA",
        owner: "BELUM ADA",
        status: "OPEN",
        nilai_sroi: parseInt(0),
        bast:bast,
        certificate: "-",
        laporan:laporan || "-",
        kebutuhan:kebutuhan || "-",
        cost: parseInt(values.cost || 0),
        actual: parseInt(values.actual || 0)
      })).unwrap();
      if(role === 3){
        history.push("/app/proyek-opd");
      }else if(role === 1){
        history.push("/app/projects");
      }else{
        history.push("/app/my-projects");
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
      await dispatch(updateProject({
        ...values,
        id: location?.state?.id,
        name:values.name.toUpperCase(),
        latitude: markerLocation.latitude ? markerLocation.latitude?.toString() : "-2.990934",
        longitude: markerLocation.longitude ? markerLocation.longitude?.toString() : "104.756554",
        pic_id: 1,
        vendor_id: 1,
        sdg: values.sdg || "LAINNYA",
        status: role === 1 || role === 4 ? values.status : "OPEN",
        opd: opd,
        file: '-',
        diskon_pajak: parseInt(values.diskon_pajak || 0),
        description: values.description ? values.description : '-',
        proposal: values.proposal ? values.proposal : '-',
        kecamatan: values.kecamatan ? values.kecamatan : "SUMATERA SELATAN",
        kelurahan: values.kelurahan ? values.kelurahan : "SUMATERA SELATAN",
        koordinat: values.koordinat ? values.koordinat : "SUMATERA SELATAN",
        kabupaten: kabupaten,
        endDate: values.deadline,
        sgd: values.sdg || "LAINNYA",
        kategori: values.kategori || "LAINNYA",
        certificate: values.certificate ?  values.certificate : "-",
        perusahaan: "BELUM ADA",
        owner: "BELUM ADA",
        nilai_sroi: parseInt(values.nilai_sroi || 0),
        cost: parseInt(values.cost || 0),
        actual: parseInt(values.actual || 0),
        bast:bast,
        laporan:laporan,
        kebutuhan:kebutuhan,
      })).unwrap();
      if(role === 3){
        history.push("/app/proyek-opd");
      }else if(role === 1){
        history.push("/app/projects");
      }else{
        history.push("/app/my-projects");

      }
    } catch (error) {
      message.error(error?.message || "Failed to fetch data");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const getDataById = async (id) => {
    try {
      const data = await dispatch(fetchOneProject(id)).unwrap();
      setMarkerLocation({
        latitude: parseFloat(data.data.latitude),
        longitude: parseFloat(data.data.longitude),
      })
      setKabupaten(data.data.kabupaten)
      setKategori(data.data.kategori)
      setSdg(data.data.sdg)
      setOpd(data.data.opd)
      setKebutuhan(data.data.kebutuhan)
      setLaporan(data.data.laporan)
      setBast(data.data.bast)
      form.setFieldsValue({
        ...data.data,
        startDate: moment(data.data.startDate),
        // endDate:moment(data.data.endDate),
        deadline: moment(data.data.deadline),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getSubcategories = async () => {
    try {
      const response = await dispatch(fetchAllSubcategory()).unwrap();
      setSubcategories(
        response.data.map((category) => {
          return {
            value: category.id,
            label: category.name,
          };
        })
      );
    } catch (error) {
      message.error(error?.message || "Failed to fetch data");
    }
  };

  useEffect(() => {
    if (location?.state?.id) {
      getDataById(location?.state?.id);

    }
    getSubcategories();
    getTags();
    getProfile()
    getAllCompanies()
  }, []);

  return (
    <>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <h2>Tambah/Update Proyek Baru {opd} Kabupaten {kabupaten}</h2>
          <p>Tolong isi proyek baru di form ini sesuai dengan data</p>
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
                label="Nama Proyek"
                name="name"
              >
                <Input  />
              </Form.Item>

              {role === 1 && (
                <Form.Item
                  label="Penyedia Dana"
                  name="perusahaan"
                >
                  <Select options={companies}  />
                </Form.Item>
              )}

              {role === 4 && (
                <Form.Item
                  label="Penyedia Dana"
                  name="perusahaan"
                >
                  <Select options={companies} disabled={role !== 1 ? true : false} />
                </Form.Item>
              )}

              <Form.Item
                label="Koordinat (Link Google Map)"
                name="koordinat"
              >
                <Input defaultValue={'-'}  />
              </Form.Item>

              {(location?.state?.id ) ? (
                <Card>
                  {((markerLocation.latitude && markerLocation.longitude) && (
                    <Map latitude={markerLocation.latitude} longitude={markerLocation.longitude} onMarkerChange={handleLocationChange}></Map>
                  ))}
                </Card>
              ) : (
                <Card>
                  <Map latitude={-2.990934} longitude={104.756554} onMarkerChange={handleLocationChange}></Map>
                </Card>
              )}

              <Form.Item
                label="Alamat Lengkap"
                name="lokasi"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Kelurahan (Contoh: SILABERANTI)"
                name="kelurahan"
              >
                <Input defaultValue={"LAINNYA"}  />
              </Form.Item>

              <Form.Item
                label="Kecamatan (Contoh: SEBERANG ULU I)"
                name="kecamatan"
              >
                <Input defaultValue={"LAINNYA"}  />
              </Form.Item>

              {/* <Form.Item
                label="Kabupaten"
                name="kabupaten"
              >
                <Select defaultValue={kabupaten} options={kabupatens} disabled  />
              </Form.Item>

              <Form.Item
                label="OPD"
                name="opd"
              >
                <Select defaultValue={opd} options={opds} disabled  />
              </Form.Item> */}

              <Form.Item
                label="Kategori"
                name="kategori"
              >
                <Select defaultValue={kategori} options={categories}  />
              </Form.Item>

              <Form.Item
                label="SDG"
                name="sdg"
              >
                <Select defaultValue={sdg} options={sdgs}  />
              </Form.Item>

              <Form.Item
                label="Pelaksana"
                name="pelaksana"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Tanggal Mulai"
                name="startDate"
              >
                <DatePicker format={'YYYY-MM-DD'}  />
              </Form.Item>

              <Form.Item
                label="Tanggal Selesai"
                name="deadline"

              >
                <DatePicker format={'YYYY-MM-DD'}  />
              </Form.Item>

              <Form.Item
                label="Nilai Proyek"
                name="cost"

              >
                <Input />
              </Form.Item>

              {location?.state?.id && (
                <Form.Item
                  label="Aktual Proyek"
                  name="actual"
                >
                  <Input />
                </Form.Item>
              )}

              {/* <Form.Item
                label="Subcategory"
                name="vendor_id"
              >
                <Select
                  defaultValue="Not Picked"
                  style={selectStyle}
                  options={subcategories}
                />
              </Form.Item> */}

              {role === 1 && (
                <Form.Item
                  label="Status"
                  name="status"
                  rules={rules}
                >
                  <Select
                    defaultValue="Not Picked"
                    style={selectStyle}
                    options={[{
                      label: "OPEN",
                      value: "OPEN"
                    }, {
                      label: "CLOSED",
                      value: "CLOSED"
                    }, {
                      label: "CERTIFIED",
                      value: "CERTIFIED"
                    }]}
                  />
                </Form.Item>
              )}

              {role === 4 && (
                <Form.Item
                  label="Status"
                  name="status"
                  rules={rules}
                >
                  <Select
                    defaultValue="Not Picked"
                    style={selectStyle}
                    options={[{
                      label: "OPEN",
                      value: "OPEN"
                    }, {
                      label: "CLOSED",
                      value: "CLOSED"
                    }, {
                      label: "CERTIFIED",
                      value: "CERTIFIED"
                    }]}
                  />
                </Form.Item>
              )}

              {/* <Form.Item
                label="File URL"
                name="file"
              >
                <Input />
              </Form.Item> */}

              <Form.Item
                label="No Phone"
                name="no_phone"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Proposal (https://drive.google.com)"
                name="proposal"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Description (Max 255 Characters)"
                name="description"
              >
                <Input />
              </Form.Item>

              <Tabs>
                <Tabs.TabPane tab="Detail Kebutuhan" label="item-1">
                  <Form.Item>
                    <MyEditor
                      data={kebutuhan}
                      setState={setKebutuhan}
                      defaultValue="Konten"
                    />
                  </Form.Item>
                </Tabs.TabPane>
                
              </Tabs>
              
              <Tabs>
                <Tabs.TabPane tab="Progress" label="item-1">
                  <Form.Item>
                    <MyEditor
                      data={bast}
                      setState={setBast}
                      defaultValue="Konten"
                    />
                  </Form.Item>
                </Tabs.TabPane>
                
              </Tabs>

              <Tabs>
                <Tabs.TabPane tab="Laporan" label="item-1">
                  <Form.Item>
                    <MyEditor
                      data={laporan}
                      setState={setLaporan}
                      defaultValue="Konten"
                    />
                  </Form.Item>
                </Tabs.TabPane>
                
              </Tabs>

              <Form.Item>
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

export default DETAIL_PROJECT;
