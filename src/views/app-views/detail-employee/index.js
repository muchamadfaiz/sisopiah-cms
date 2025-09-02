import { Col, Row, message, Typography, Divider, Tabs, DatePicker, InputNumber } from "antd";
import React, { useEffect, useState } from "react";
import { Button, Card, Form, Input } from "antd";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Select } from "antd";
import { fetchAllWajib } from "redux/features/wajib_pajak";
import { fetchAllTags } from "redux/features/tags";
import { getUserProfile } from "redux/features/auth";
import moment from "moment";
import { fetchAllGuardians } from "redux/features/guardians";
import { addEmployee, fetchOneEmployee, updateEmployee } from "redux/features/employee";

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

export const DETAIL_EMPLOYEE = () => {
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

  const onFinish = (values) => {
    // const payload = {
    //   ...values,
    //   //   joined_at: values.joined_at ? moment(values.joined_at).format("YYYY-MM-DD") : null,
    //   ...(values.joined_at ? { joined_at: moment(values.joined_at).format("YYYY-MM-DD") } : {}),
    // };
    const payload = { ...values };

    if (values.joined_at) {
      payload.joined_at = moment(values.joined_at).format("YYYY-MM-DD");
    } else {
      // hapus biar nggak ngirim null
      delete payload.joined_at;
    }

    console.log("Formatted payload:", payload);

    if (location?.state?.id) {
      updateData({ ...payload, id: location.state.id });
    } else {
      createData(payload);
    }
  };

  const getProfile = async () => {
    try {
      const response = await dispatch(getUserProfile()).unwrap();
      setRole(response.data.user.role_id);
      setPerusahaan(response.data.user.perusahaan);
    } catch (error) {
      setLoading(false);
      message.error(error?.message || "Failed to fetch data");
    }
  };

  const getAllCompanies = async () => {
    try {
      const { data } = await dispatch(fetchAllWajib({ limit: 1000 })).unwrap();
      const list_pt = data.data.map((item) => ({
        value: item.perusahaan,
        label: item.perusahaan,
      }));

      setCompanies(list_pt);
    } catch (err) {
      console.log(err);
    }
  };

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
      await dispatch(
        addEmployee({
          ...values,
        })
      ).unwrap();
      history.push("/app/employees");
    } catch (error) {
      message.error(
        error.message ||
          "Ada yang salah dengan data anda! Pastikan semua nilai terisi, jika tidak ada isikan dengan nilai '-'"
      );
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
      await dispatch(
        updateEmployee({
          ...values,
        })
      ).unwrap();
      //   if (role === 3) {
      //     history.push("/app/projects-opd");
      //   } else if (role === 1) {
      //     history.push("/app/projects");
      //   } else {
      history.push("/app/employees");
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
      const res = await dispatch(fetchOneEmployee(id)).unwrap();
      const employee = res.data;
      form.setFieldsValue({
        ...employee,
        joined_at: employee.joined_at ? moment(employee.joined_at) : null,
      });
    } catch (err) {
      console.log(err);
    }
  };

  //   const getSubcategories = async () => {
  //     try {
  //       const response = await dispatch(fetchAllGuardians()).unwrap();
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

  useEffect(() => {
    if (location?.state?.id) {
      console.log("id: ", location?.state?.id);
      getDataById(location?.state?.id);
    }
  }, []);

  //   useEffect(() => {
  //     getSubcategories();
  //   }, []);

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
          <h2>Tambah/Update staff baru</h2>
          {/* <p>Tolong isi proyek baru di form ini sesuai dengan data</p> */}
          <p>Tolong isi staff baru di form ini sesuai dengan data</p>
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
              <Typography.Title level={5}>Profil Staff</Typography.Title>
              <Form.Item label="Nama" name="name" rules={rules}>
                <Input />
              </Form.Item>

              <Form.Item label="NIP" name="nip" rules={rules}>
                <Input />
              </Form.Item>

              <Form.Item label="Jabatan" name="position" rules={rules}>
                <Input />
              </Form.Item>

              <Form.Item label="Unit" name="unit">
                <Input />
              </Form.Item>

              <Form.Item label="Nama Rekening" name="bank_account_name">
                <Input />
              </Form.Item>

              <Form.Item label="No Rekening" name="bank_account_number">
                <Input />
              </Form.Item>

              <Form.Item label="Bank" name="bank_name">
                <Input />
              </Form.Item>

              <Form.Item label="Tanggal Masuk" name="joined_at">
                <DatePicker allowClear format="YYYY-MM-DD" style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item wrapperCol={24}>
                <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
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

export default DETAIL_EMPLOYEE;
