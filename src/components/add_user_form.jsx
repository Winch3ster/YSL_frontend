import React from 'react';
import { Form, Input, Button, Select } from 'antd';

const { Option } = Select;

const AddUserForm = ({ closeModal, refresh }) => {
  const [addUserForm] = Form.useForm();

  const onFinish = async (values)  => {
    console.log('Success:', values);

     try {

            const response = await fetch(`http://127.0.0.1:5000/addUser`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ 
                    name: values.name,
                    username: values.username,
                    password: values.password,
                    role: values.role
                }), // POST body
            });


            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            closeModal();
            refresh();
        } catch (error) {
            console.error('Error updating condition details:', error);
        }


    // Send to backend here
    alert('Form submitted successfully!');
  };


  const onFinishFailed = (errorInfo) => {
    alert('Failed:', errorInfo);
  };

  return (
    <Form
      form={addUserForm}
      layout="vertical"
      name="register"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please input your name!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Role"
        name="role"
        rules={[{ required: true, message: 'Please select a role!' }]}
      >
        <Select placeholder="Select a role">
          <Option value="Admin">Admin</Option>
          <Option value="Practitioner">Practitioner</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Confirm Password"
        name="confirm"
        dependencies={['password']}
        hasFeedback
        rules={[
          { required: true, message: 'Please confirm your password!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error('The two passwords that you entered do not match!')
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddUserForm;
