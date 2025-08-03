import { Card, Col, Row, message } from "antd";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import StatisticWidget from "components/shared-components/StatisticWidget";
import { useDispatch } from "react-redux";
import { fetchProjectSummary } from "redux/features/projects";
import { fetchAllDapurs } from "redux/features/students";
import { fetchAllProjects, fetchRankingCompany } from "redux/features/projects";
import { kabupatens, opds, categories, sdgs } from '../../../constants/DataConstant'
import { getUserProfile } from "redux/features/auth";
import { PROJECTS } from "../projects";
import Map from "../../../components/Maps";
import OPD_PROJECTS from "../murid";
import VerificationProjects from "../verification-projects";
import { MYPROJECTS } from "../my-projects";

let IDRFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'IDR',
});

export const DefaultDashboard = () => {
  const dispatch = useDispatch();
  const [target, setTarget] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [myProjects, setMyProjects] = useState(0);
  const [allProjects, setAllProjects] = useState([]);
  const [myTarget, setMyTarget] = useState(0);
  const [myActual, setMyActual] = useState(0);
  const [allDapurs, setAllDapurs] = useState([]);
  const [perusahaan, setPerusahaan] = useState(0);
  const [OPD, setOPD] = useState(0);
  const [ranking, setRanking] = useState(0);
  const [sroi, setSROI] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [actual, setActual] = useState(0);
  const [role, setRole] = useState(0);
  const [company, setCompany] = useState("");

//   const getAllDashboardData = async (params) => {
//     try {
//       const response = await dispatch(getUserProfile()).unwrap();
//       const summary = await dispatch(fetchProjectSummary()).unwrap();
//       const mySummary = await dispatch(fetchProjectSummary({ owner: response.data.user.perusahaan })).unwrap();
//       const opdSummary = await dispatch(fetchProjectSummary({ opd: response.data.user.opd })).unwrap();

//       setMyProjects(response.data.user.role_id === 3 ? opdSummary.data.totalProjects : mySummary.data.totalProjects)
//       setMyActual(response.data.user.role_id === 3 ? opdSummary.data.totalAmount._sum.actual : mySummary.data.totalAmount._sum.actual);
//       setMyTarget(response.data.user.role_id === 3 ? opdSummary.data.totalAmount._sum.cost : mySummary.data.totalAmount._sum.cost);

//       setActual(summary.data.totalAmount._sum.actual || 0);
//       setTarget(summary.data.totalAmount._sum.cost || 0);
//       setTotalProjects(summary.data.totalProjects)
//     } catch (error) {
//       message.error(error?.message || "Failed to fetch data");
//     }
//   };

  const getData = async () => {
    try {
      const response = await dispatch(fetchAllProjects()).unwrap();
      setAllProjects(response.data.Projects)
      setLoading(false);
    } catch (error) {
      message.error(error?.message || "Failed to fetch data");
    }
  }

  const getProfile = async () => {
    try {
      const response = await dispatch(getUserProfile()).unwrap();
      setRole(response.data.user.role_id)
      setCompany(response.data.user.perusahaan)
      setOPD(response.data.user.opd)
      getData();
    } catch (error) {
      setLoading(false);
      message.error(error?.message || "Failed to fetch data");
    }
  };

   const getAllDapur = async () => {
    try {
      const response = await dispatch(getAllDapur()).unwrap();
      setRole(response.data.user.role_id)
      setCompany(response.data.user.perusahaan)
      setOPD(response.data.user.opd)
      getData();
    } catch (error) {
      setLoading(false);
      message.error(error?.message || "Failed to fetch data");
    }
  };

  useEffect(() => {
    // getProfile()
    // getAllDashboardData()
    // getCompanyRanking()
    // getDataDapur()
  }, []);

  return (
    <>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <h2>Selamat Datang</h2>
          <p>
            Jika menemukan bug ataupun error pada aplikasi ini bisa langsung hubungi kami di <a target="_blank" href="https://wa.me/6281376504236">081376504236</a>
          </p>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Row gutter={24}>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} key={1}>
              <StatisticWidget
                style={{ textAlign: "center" }}
                title={`Semua Murid`}
                value={myProjects}
              />
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} key={2}>
              <StatisticWidget
                style={{ textAlign: "center" }}
                title={`Semua Wali Murid`}
                value={myProjects}
              />
            </Col>
          </Row>
          {/* <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Card>
                <Map projects={allDapurs}></Map>
                <h5 style={{ margin: "5px" }}>Legends:</h5>
                <div>
                  {categories.map(data => {
                    console.log(data)
                    return <>
                      <span
                        style={{
                          display: 'inline-block',
                          width: '10px',
                          height: '10px',
                          backgroundColor: data.color,  // Assuming you have a color field in your data
                          borderRadius: '50%',
                          marginRight: '10px'
                        }}
                      ></span>
                      <span style={{ margin: "5px" }}>{data.label}</span>
                    </>
                  })}
                </div>
              </Card>
            </Col>
          </Row> */}
           {/* {role === 1 && (
            <Row>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <PROJECTS></PROJECTS>
              </Col>
            </Row>
          )}
          {role === 2 && (
            <Row>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <MYPROJECTS></MYPROJECTS>
              </Col>
            </Row>
          )} */}
          {/* {role === 4 && (
            <Row>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <PROJECTS></PROJECTS>
              </Col>
            </Row>
          )} */}
          { (
            <Row>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <OPD_PROJECTS></OPD_PROJECTS>
              </Col>
            </Row>
          )}
          {/* {role === 5 && (
            <Row>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <VerificationProjects></VerificationProjects>
              </Col>
            </Row>
          )} */}
        </Col>
      </Row>
    </>
  );
};

export default withRouter(DefaultDashboard);
