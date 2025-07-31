import { Button, Card, Col, Row, Table, message, Input, DatePicker } from 'antd';
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, withRouter } from 'react-router-dom';
import moment from 'moment';
import { fetchAllSurat, fetchAllByTanggalFilter } from 'redux/features/surat';
import CsvDownloadButton from 'react-json-to-csv'
import { exportToExcel } from 'react-json-to-excel';
import { Select, Modal } from 'antd';

const selectStyle = {
    width: "24%",
    backgroundColor: "white",
    marginRight: "2%"
};

const rules = [
    {
        required: true,
        message: 'Wajib Diisi!',
    }
]

const options = [
    {
        value: 'SEMUA',
        label: 'SEMUA',
    },
    {
        value: 'KELUAR',
        label: 'KELUAR',
    },
    {
        value: 'MASUK',
        label: 'MASUK',
    }
]

export const LAPORAN = () => {
    const history = useHistory()
    const [isLoading, setLoading] = useState(true)
    const dispatch = useDispatch()
    const { Search } = Input
    const [startDateState, setStartDate] = useState()
    const [endDateState, setEndDate] = useState()
    const [perihal, setPerihal] = useState()
    const [jenisSurat, setJenisSurat] = useState()

    const {
        list,
        selectedRows,
        filter: { q: searchTerm },
        loading: {
            query: loadingQuery,
            mutation: loadingMutation
        }
    } = useSelector(state => state.surat)

    const getData = useCallback(async () => {
        try {
            const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
            const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');
            await dispatch(fetchAllByTanggalFilter({
                startDate: startOfMonth,
                endDate: endOfMonth
            })).unwrap()
            setLoading(false)
        } catch (error) {
            message.error(error?.message || 'Failed to fetch data')
        }
    }, [dispatch])

    const cariSuratLengkap = useCallback(async (perihal, jenisSurat, startDate, endDate) => {
        try {
            await dispatch(fetchAllSurat({
                perihal,
                jenisSurat,
                startDate,
                endDate
            })).unwrap()
            setLoading(false)
        } catch (error) {
            message.error(error?.message || 'Failed to fetch data')
        }
    }, [dispatch])

    // const getDataWithTanggal = useCallback(async (startDate, endDate) => {
    //     try {
    //         await dispatch(fetchAllByTanggalFilter({
    //             startDate: startDate,
    //             endDate: endDate
    //         })).unwrap()
    //         setLoading(false)
    //     } catch (error) {
    //         message.error('Gagal mencari data pastikan kedua tanggal sudah terisi!')
    //     }
    // }, [dispatch])

    useEffect(() => {
        getData()
    }, [])

    const tableColumns = [
        {
            title: 'Tanggal Keluar',
            dataIndex: 'tanggalSurat',
            render: (_, record) => {
                return (
                    moment(record.tanggalSurat).format("DD-MMM-YY")
                )
            }
        },
        {
            title: 'Nomor Surat',
            dataIndex: 'nomorSurat',
            key: 'nomorSurat',
        },
        {
            title: 'Perihal',
            dataIndex: 'perihal',
            key: 'perihal',
        },
        {
            title: 'Projects',
            dataIndex: 'project',
            key: 'project',
        },
        {
            title: 'Penerima',
            dataIndex: 'penerima',
            key: 'penerima',
        },
        {
            title: 'PIC',
            dataIndex: 'pic',
            key: 'pic',
        },
        {
            title: 'Qty Materai',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Hard File',
            dataIndex: 'hard',
            key: 'hard',
        },
        {
            title: 'Soft File',
            dataIndex: 'externalFile',
            render: (_, record) => {
                return (
                    <a target='_blank' href={record.externalFile}>Cek File</a>
                )
            },
        },
        {
            title: () => <div className="text-center">Jenis Surat</div>,
            key: 'jenisSurat',
            render: (_, record) => {
                {
                    if (record.jenisSurat === "MASUK") {
                        return (
                            <h5 style={{ color: "blue", textAlign: "center" }}>MASUK</h5>
                        )
                    } else {
                        return (
                            <h5 style={{ color: "green", textAlign: "center" }}>KELUAR</h5>
                        )
                    }
                }
            },
        },
        {
            title: () => <div className="text-center">Detail</div>,
            key: 'status',
            render: (_, record) => {
                
                if (record.jenisSurat === "MASUK") {
                    return (
                        (
                            <div className="text-center">
                                <a type="primary" style={{ width: "70%" }} onClick={() => {
                                    history.push({
                                        pathname: '/app/detail-surat-masuk',
                                        id: record._id,
                                    })
                                }} >Edit</a>
                            </div>
                        )
                    )
                } else {
                    return (
                        (
                            <div className="text-center">
                                <a type="primary" style={{ width: "70%" }} onClick={() => {
                                    history.push({
                                        pathname: '/app/detail-surat-keluar',
                                        id: record._id,
                                    })
                                }} >Edit</a>
                            </div>
                        )
                    )
                }
            }
        },
    ];

    const onSearch = async (event) => {
        setPerihal(event.target.value)
    }

    const selectJenisSurat = (value) => {
        setJenisSurat(value)
    }

    return (
        <>
            <Row gutter={24}>
                <Col xs={24} sm={24} md={24} lg={24}>
                    <h2>Semua Surat di bulan {moment().format('MMMM')}</h2>
                    <p>Semua surat yang telah masuk dan dibutuhkan tindakan lanjut</p>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col xs={24} sm={24} md={24} lg={24}>
                    <Card>
                        <div style={{ display: "flex" }}>
                            <Input
                                placeholder="Cari Berdasarkan Perihal"
                                onChange={onSearch}
                                style={{
                                    width: "49%",
                                    marginRight: "2%"
                                }}
                            />

                            <DatePicker
                                onChange={(value) => {
                                    setStartDate(moment(value).format("YYYY-MM-DD"))
                                }}
                                style={{
                                    width: "24%",
                                    marginRight: "2%"
                                }} placeholder='Tanggal Mulai' />
                            <DatePicker
                                onChange={(value) => {
                                    setEndDate(moment(value).format("YYYY-MM-DD"))
                                }}
                                style={{
                                    width: "24%",
                                    marginRight: "2%"
                                }} placeholder='Tanggal Selesai' />

                            <Select
                                defaultValue={"Jenis Surat"}
                                style={selectStyle}
                                onChange={selectJenisSurat}
                                options={options}
                            />

                            <Button type="primary" style={{ width: "25%" }} onClick={() => { cariSuratLengkap(perihal, jenisSurat, startDateState, endDateState) }}>Cari Surat</Button>
                        </div>
                        <Table
                            className="no-border-last"
                            columns={tableColumns}
                            loading={isLoading}
                            dataSource={list}
                            rowKey='id'
                        />
                    </Card>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col xs={24} sm={24} md={24} lg={24}>
                    <Button type="primary" style={{ border: "0px", width: "100%" }} onClick={() => exportToExcel(list, 'report')}>Download as Excel</Button>
                </Col>
            </Row>
            <br></br>
            <Row gutter={24}>
                <Col xs={24} sm={24} md={24} lg={24}>
                    <CsvDownloadButton style={{ width: "100%", padding: "3px" }} data={list}>Download as CSV</CsvDownloadButton>
                </Col>
            </Row>
        </>
    )
}


export default withRouter(LAPORAN);
