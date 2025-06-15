import { Form, Input, Button, Select } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect,useState   } from 'react'
import { useNavigate, useParams  } from 'react-router-dom';
import Loading from '../components/loading';


const EditCustomerDetailsPage = () => {
    const navigate = useNavigate();
    const { customerID } = useParams();
    const [customerData, setCustomerData ] = useState();
    const [isLoading, setIsLoading] = useState(true)
    const fetchCustomerDetails = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/customer/${customerID}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCustomerData(data);
            setIsLoading(false)
        } catch (error) {
            console.error('Error fetching customer details:', error);
        }
    }


    const updateCustomerDetails = async (values) =>{
        try{
            const response = await fetch(`http://127.0.0.1:5000/editCustomerDetails/${customerID}`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ 
                    "address": values.address,
                    "customerId": customerID,
                    "customerName": values.name,
                    "email": values.email,
                    "gender": values.gender,
                    "handphone": values.phoneNumber,
                    "discoveryMethod": values.centerDiscovery,
                    "ic": values.ic,
                    "instagram": values.instagram,
                    "oldCustomerId": values.oldCustomerId,
                    "race": values.race,
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

    useEffect(() => {
        fetchCustomerDetails();
    },[]);
    
    function onSubmitChange(values){
        console.log(values)
        console.log("adhgawgjdajwdawhb")
        console.log(values.name)

        updateCustomerDetails(values);      
    }

    function onSubmitFailed(error){
        alert('Error submitting change: ', error)
        console.log(error);
        console.log()
    }

    return isLoading ? 
    (
        <Loading></Loading>
    )
    :
    (
        <>
        {console.log(customerData)}
            <div className='p-5'>
                <p>Customer ID: {customerID ?? "-"}</p>

                <Form
                    name="editCustomerDetailsForm"
                    onFinish={onSubmitChange}
                    onFinishFailed={onSubmitFailed}
                    labelCol={{span:9}}
                    wrapperCol={{span:15}}
                    style={{maxWidth:900}}
                    autoComplete='off'
                    layout='vertical'
                    initialValues={{
                        "oldCustomerId": customerData.oldCustomerId,
                        "name":customerData.customerName,
                        "email": customerData.email,
                        "ic":customerData.ic,
                        "gender": customerData.gender,
                        "address": customerData.address,
                        "phoneNumber": customerData.handphone,
                        "instagram":customerData.instagram,
                        "centerDiscovery":customerData.howDidYouFindUs,
                        "race":customerData.race,
                    }}
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
        </>
    )
}

export default EditCustomerDetailsPage