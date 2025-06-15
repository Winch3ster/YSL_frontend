import React, { useState,useEffect } from 'react'
import AddUserForm from '../components/add_user_form.jsx'
import { Card, Modal, Table } from 'antd'
import SizedBox from '../components/sizedBox'
import Loading from '../components/loading.jsx'
import StandardButton from '../components/standard_button.jsx'

const AdminConfigPage = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [accountList, setAccountList] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const [deleteUserModalConfirmation, setDeleteUserModalConfirmation]= useState(false)
    const [currentDeleteUserId, setCurrentDeleteUserId]= useState()

    const fetchAllUsers = async () => {
        try{
            const response = await fetch(`http://127.0.0.1:5000/getAllAccounts`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log("THAIJDOWAODKAW")
            console.log(data)
            setAccountList(data.accounts);
            setIsLoading(false)
        }catch(e){
            alert("Error: " + e);
        }
    }
    useEffect(() => async () => {
        await fetchAllUsers();
        setIsLoading(false);
    },[])
    

    const deleteUser = async ()  => {
        try{
            const response = await fetch(`http://127.0.0.1:5000/deleteUserByID/${currentDeleteUserId}`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setDeleteUserModalConfirmation(false)
            alert("User removed successfully")
            
            setIsLoading(true)
            await fetchAllUsers();
            setIsLoading(false);


        }catch(e){
            alert("Error: " + e);
        }
    }

    function onClickDeleteUser(id){
        setCurrentDeleteUserId(id);
        setDeleteUserModalConfirmation(true)
    }
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                console.log(record.id)
                return <StandardButton label="Delete" danger={true} onClick={() => onClickDeleteUser(record.id)}></StandardButton>
            },
        },
    ];

    const openAddAccountModelButton =() => {
        return(
            <StandardButton label="Add User" onClick={() => setModalOpen(true)}></StandardButton>
        )
    }


    return isLoading ? 
    <Loading></Loading>
    :
    (
        <div>
            <div>Admin Configuration</div>

            <SizedBox height={50}></SizedBox>
            <Card title="Accounts" extra={openAddAccountModelButton()}>
                <Table dataSource={accountList} columns={columns}>
                </Table>
            </Card>

            <Modal
                title="Add User"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={modalOpen}
                footer={null}
                onCancel={() => setModalOpen(false)}

            >
                <AddUserForm closeModal={() => setModalOpen(false)} refresh={() => fetchAllUsers()}></AddUserForm>

            </Modal>


            <Modal
                title="Confirm Delete?"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={deleteUserModalConfirmation}
                onOk={() => deleteUser()}
                onCancel={() => setDeleteUserModalConfirmation(false)}

            >
                <p>You are about to perform a DELETE function on user with:
                    <br></br> 
                    <span className='font-bold'>
                        ID {currentDeleteUserId}
                    </span>
                    <br></br> 
                    Are you sure?</p>

            </Modal>


        </div>
    )
}

export default AdminConfigPage