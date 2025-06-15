import { Form, Input, Button, Select } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';
import { useNavigate  } from 'react-router-dom';


const AddCustomerDetailsPage = () => {
    const navigate = useNavigate();

    const registerCustomer = async (values) =>{
        try{
            const response = await fetch(`http://127.0.0.1:5000/registerCustomer/`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ 
                    "address": values.address ?? "",
                    "customerName": values.name ?? "",
                    "email": values.email ?? "",
                    "gender": values.gender ?? "",
                    "handphone": values.phoneNumber,
                    "discoveryMethod": values.centerDiscovery ?? "",
                    "ic": values.ic ?? "",
                    "instagram": values.instagram ?? "",
                    "oldCustomerId": values.oldCustomerId ?? "",
                    "race": values.race ?? "",
                }), // POST body
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }else{
                alert('Customer details updated successfully!');
                navigate(-1); // Navigate back to the previous page
            }
        }catch (error){
            alert('Error submitting change: ', error)
        }
    }

    
    function onSubmitChange(values){
        console.log(values)
        console.log("adhgawgjdajwdawhb")
        console.log(values.name)

        registerCustomer(values);      
    }

    function onSubmitFailed(error){
        alert('Error submitting change: ', error)
        console.log(error);
        console.log()
    }

    return (
  
    <div className='p-5'>
        <Form
            name="registerCustomerForm"
            onFinish={onSubmitChange}
            onFinishFailed={onSubmitFailed}
            labelCol={{span:9}}
            wrapperCol={{span:15}}
            style={{maxWidth:900}}
            autoComplete='off'
            layout='vertical'
        >   
            <Form.Item
                label="Old Customer ID"
                name="oldCustomerId"
            >
                <Input></Input>
            </Form.Item> 

            <Form.Item
                label="Name"
                name="name"
                rules={[{
                    required: true,
                    message:"Please input customer name!"
                }]}
            >
                <Input></Input>
            </Form.Item> 

            <Form.Item
                label="Email"
                name="email"
                rules={[{
                    required: true,
                    message:"Please input customer email!"
                }]}
            >
                <Input></Input>
            </Form.Item>

            <Form.Item
                label="IC / Passport"
                name="ic"
                rules={[{
                    required: true,
                    message:"Please input customer IC!"
                }]}
            >
                <Input></Input>
            </Form.Item>

            <Form.Item
                label="Gender"
                name="gender"
                rules={[{
                    required: true,
                    message:"Please select customer gender!"
                }]}
            >
                <Select placeholder="Select gender">
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                </Select>
            </Form.Item>

            <Form.Item
                label="Race"
                name="race"
                rules={[{
                    required: true,
                    message:"Please input customer race!"
                }]}
            >
                    <Input></Input>
            </Form.Item>

            <Form.Item
                label="Address"
                name="address"
                rules={[{
                    required: true,
                    message:"Please input customer email!"
                }]}
            >
                <TextArea></TextArea>
            </Form.Item>
            
            <Form.Item
                label="Phone Number"
                name="phoneNumber"
                rules={[{
                    required: true,
                    message:"Please input customer phone number!"
                }]}
            >
                <Input ></Input>
            </Form.Item>


            <Form.Item
                label="Instagram"
                name="instagram"
            >
                <Input></Input>
            </Form.Item>

            
            <Form.Item
                label="How did you get know our center?"
                name="centerDiscovery"
            >
                <TextArea></TextArea>
            </Form.Item>

            <Form.Item
                label={null}
            >
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    </div>
    )
}

export default AddCustomerDetailsPage