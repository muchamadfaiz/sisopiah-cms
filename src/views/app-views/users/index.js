import { Button, Card, Col, message, Row, Table, Input, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState, useCallback } from "react";
import { useHistory, withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { strings } from "res";
import { fetchAllUser, deleteUser } from 'redux/features/user';
import moment from 'moment';

const LocalizedModal = () => {
    const [open, setOpen] = useState(false);
    const [metaData, setMetaData] = useState({});
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
                <p>Bla bla ...</p>
                <p>Bla bla ...</p>
                <p>Bla bla ...</p>
            </Modal>
        </>
    );
};


export const USERS = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const [isLoading, setLoading] = useState(true)
    const [data, setData] = useState()
    const [modal, contextHolder] = Modal.useModal();
    const [metaData, setMetaData] = useState({});

    const { Search } = Input

    const [filters, setFilters] = useState({
        page: 1,
        limit: 1000
      });

    const tableColumns = [
   {
      title: "No",
      dataIndex: "no",
      key: "no",
      render: (_text, _record, index) =>
        (filters.page - 1) * filters.limit + index + 1,
    },
    {
        title: 'Username',
        dataIndex: 'username',
        key: 'username',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    // {
    //     title: 'OPD',
    //     dataIndex: 'opd',
    //     key: 'opd',
    // },
    {
        title: 'Kabupaten',
        dataIndex: 'regency',
        key: 'regency',
    },
    {
        title: 'Role',
        dataIndex: 'role_id',
        key: 'role_id',
    },
    // {
    //     title: 'Instansi',
    //     dataIndex: 'perusahaan',
    //     key: 'perusahaan',
    // },
    // {
    //     title: 'OPD',
    //     dataIndex: 'opd',
    //     key: 'opd',
    // },
    {
        title: 'No Phone',
        dataIndex: 'no_phone',
        key: 'no_phone',
    },
    {
        title: () => <div className="text-center">Detail</div>,
        key: 'status',
        render: (_, record) => (
            <div className="text-center">
                <Button type="primary" style={{ textAlign: "center" }} onClick={() => {
                    history.push({
                        pathname: `${strings.navigation.path.detail_user}`,
                        state: record,
                    })
                }}>Detail</Button>
            </div>
        ),
    },
    {
        title: () => <div className="text-center">Action</div>,
        key: 'status',
        render: (_, record) => (
            <div className="text-center">
                <Button type="danger" style={{ textAlign: "center", color: "white" }} onClick={() => {
                    confirm(record.id)
                }}>Delete</Button>
            </div>
        ),
    },
    ]

    const getData = async (params) => {
        try {
            const response = await dispatch(fetchAllUser(params)).unwrap()
            setData(response.data)
            setMetaData(response.meta);
            setLoading(false)
        } catch (error) {
            message.error(error?.message || 'Failed to fetch data')
        }
    }

    const confirm = (id) => {
        modal.confirm({
            title: 'Are you sure?',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure wanna delete this?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                await dispatch(deleteUser(id))
                getData()
            },
            onCancel: () => {

            }
        });
    };

    useEffect(() => {
        getData(filters)
    }, [filters])

    return (
        <>
            <LocalizedModal></LocalizedModal>
            <Row gutter={24}>
                <Col xs={24} sm={24} md={24} lg={24}>
                    <h2>Users</h2>
                    <p>All Users</p>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col xs={24} sm={24} md={24} lg={24}>
                    <Card>
                        <Input placeholder='Search By Email' ></Input>
                        <Table
                            className="no-border-last"
                            columns={tableColumns}
                            scroll={{ x: 'max-content' }} // enables horizontal scrolling
                            dataSource={data}
                            rowKey='id'
                            pagination={{
                                defaultPageSize: 10,
                                defaultCurrent: 1,
                                total: metaData.total_data,
                            }}
                        />
                    </Card>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col xs={24} sm={24} md={24} lg={24}>
                    <Button type="primary" style={{ border: "0px" }} htmlType="submit" onClick={() => {
                        history.push({
                            pathname: `${strings.navigation.path.detail_user}`
                        })
                    }} block>
                        Tambah User Baru
                    </Button>
                </Col>
            </Row>
            {contextHolder}
        </>
    )
}


export default withRouter(USERS);
