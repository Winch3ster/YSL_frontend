import React, {useState, useContext} from 'react';
import { Button, Card, Checkbox, Form, Input, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AppContext } from "../App";



const SignInView = () => {
    const { userLoginDetails, setUserLoginDetails } = useContext(AppContext);
    
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const handleSignIn = async (values) => {
        try {
        const response = await fetch('http://127.0.0.1:5000/authenticate', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ 
                username: values.username,
                password: values.password,
             }), // POST body
        });

        const result = await response.json();
        if (response.ok) {
            alert('Sign in successful!');
            console.log("User sign in details")
            console.log(result);
            setUserLoginDetails(result);
            navigate('/');
        } else {
            alert('Failed to sign in');
            console.error('Error:', result.error || 'Failed to submit.');
        }
        } catch (err) {
            alert('Error connecting to the server.');
            console.error(err);
        }
    }

    const onFinish = values => {
        handleSignIn(values);
        console.log('Success:', values);
    };
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    const handleCancel = () => {
        setShowModal(false);
    };




    const handleUpdatePassword = async (values) => {

        if (!values.oldPassword || !values.newPassword || !values.confirmNewPassword) {
            alert("Please fill in all fields.");
            return;
        }
        if( values.newPassword !== values.confirmNewPassword) {
            alert("New password and confirmation do not match.");  
            return;
        }
        // Navigate to the update password view
        try {
            const response = await fetch('http://127.0.0.1:5000/updatePassword', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ 
                    oldPassword: values.oldPassword,
                    newPassword: values.newPassword,
                }), // POST body
            });

            const result = await response.json();
            if (response.ok) {
                alert('Password updated successfully!');
                setShowModal(false);
            } else if (result.Status === 'Error') {
                alert(response.message || 'Failed to update password. Old password might be incorrect.');
            }
        } catch (err) {
            alert('Error connecting to the server.');
            console.error(err);
        }
    }
    

    return (
        <div className='flex items-center justify-center'>
            <Card title="Sign In" style={{ width: 400 }}>
                <Form 
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="remember"
                        valuePropName="checked"
                        wrapperCol={{ offset: 8, span: 16 }}
                    >   
                        <div className='text-red-500 cursor-pointer' onClick={() => setShowModal(true)}>Update Password</div>
                    </Form.Item>   

                    <Form.Item label={null}>
                        <Button type="primary" htmlType="submit" className='mr-2'>
                            Submit
                        </Button>
                        <Button
                            className='ml-2'
                                onClick={() => {
                                    navigate('/')
                                }}
                            >
                        Cancel
                    </Button>
                    </Form.Item>
                    
                </Form>
            </Card>




            <Modal
                title="Update Password"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={showModal}
                footer={null}
                onCancel={handleCancel}
            >
                <div>
                    <Form 
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={handleUpdatePassword}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                
                >
                    <Form.Item
                    label="old Password"
                    name="oldPassword"
                    rules={[{ required: true, message: 'Please input the old password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                    label="New Password"
                    name="newPassword"
                    rules={[{ required: true, message: 'Please input your new password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                   <Form.Item
                    label="Confirm New Password"
                    name="confirmNewPassword"
                    rules={[{ required: true, message: 'Please retyp your new password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item label={null}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>

                </div>
               
            </Modal>


        </div>
    )
}

export default SignInView