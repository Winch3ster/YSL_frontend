import React, { useEffect,useState,useRef,useContext   } from 'react'
import { useParams, useNavigate  } from 'react-router-dom';
import Loading from '../components/loading';
import StandardButton from '../components/standard_button';
import {Card, Flex, Modal, Row, Col, Button, Upload,message, Descriptions } from 'antd';
import TextArea from 'antd/es/input/TextArea'
import axios from 'axios';
import { AppContext } from "../App";
import SizedBox from '../components/sizedBox';

const CustomerDetails = () => {
    const {  userLoginDetails, setUserLoginDetails } = useContext(AppContext);
    
    const MAXIMUM_CHARACTER_COUNT = 300;
    const { id } = useParams();
    const navigate = useNavigate();
    const [customerData, setCustomerData] = useState(null);
    const [customerConditions, setCustomerConditions] = useState([]);
    const [isAddConditionModalOpen, setIsAddConditionModalOpen] = useState(false);
    const textAreaRef = useRef(null);
    const [characterCount, setCharacterCount] = useState(0);
    const [text, setText] = useState('');
    const [customerHasConsentForm, setCustomerHasConsentForm] = useState(false)
    const [isLoading, setIsLoading] = useState(true);

    const conditionDescriptionTextBoxOnChange = (e) => {
        const value = e.target.value;
        if (value.length <= MAXIMUM_CHARACTER_COUNT) {
            setCharacterCount(value.length);
            setText(e.target.value)
        }
    }

    const showModal = () => {
        setIsAddConditionModalOpen(true);
    };

    const handleOk = async() => {
        await handleSubmitNewCondition()
        setIsAddConditionModalOpen(false);
    };

    const handleCancel = () => {
        setText('');
        setIsAddConditionModalOpen(false);
    };

    const fetchConditions = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/customerConditions/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }else{
                const data = await response.json();
                console.log("From fetch condition")
                console.log(data)
                console.log("--------------")
                setCustomerConditions(data.data);
            }

        } catch (error) {
            console.error('Error fetching customer details:', error);
        }
    }  

    const fetchCustomerDetails = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/customer/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCustomerData(data);
        } catch (error) {
            console.error('Error fetching customer details:', error);
        }
    }


    const fetchConsentForm = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/customerConsentForm/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log("This is data fro fetch consentform: " + data);
            console.log(data)
            setCustomerHasConsentForm(data.hasConsentForm);
        } catch (error) {
            console.error('Error fetching customer details:', error);
        }
    }


    
    const renderViewCondition = (condition) => {
        return (
            <div onClick={() => navigateToConditionDetails(condition)}>
                <p className='text-blue-500'>View</p>
            </div>
        )
    }

    const fetchData = async () => {
      try {
            await fetchCustomerDetails();
            await fetchConditions();
            await fetchConsentForm();
            setIsLoading(false)
      } catch (error) {
        alert("Error fetching data:", error);
      }
    };

    // Call the async function
    

    useEffect(()  => {

        fetchData();
    },[]);


    function navigateToConditionDetails(condition) {
        if(!customerData){
            console.error("customerData is not available");
            return;
        }
        console.log("Navigating to condition details for ID:", id);
        console.log("customerData: ", customerData); // Should now show correct value
        navigate(`/condition/${condition.conditionId}`, { state: { condition, customerData } });
    }

    const handleSubmitNewCondition = async () => {
        if (!text.trim()) {
            alert("Please enter a condition description.");
            return;
        }

        try {
        const response = await fetch('http://127.0.0.1:5000/addCondition', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ 
                customerId: id,
                conditionDescription: text,
                undergoingTreatment: true,
             }), // POST body
        });

        const result = await response.json();
        if (response.ok) {
            fetchCustomerDetails();
            fetchConditions();
            fetchConsentForm();
            alert('Feedback submitted successfully!');
        } else {
            alert('Failed to submit feedback.');
            console.error('Error:', result.error || 'Failed to submit.');
        }
        } catch (err) {
            alert('Error connecting to the server.');
            console.error(err);
        }
    };
    const openConsentForm = async () =>{
         try {
            await fetch(`http://127.0.0.1:5000/viewCustomerConsentForm/${id}`);
        } catch (error) {
            console.error('Error opening consent form', error);
        }
    }

        
    const handleUpload = async (file) => {
        const extension = file.name.split('.').pop();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('customerId', id); 
        formData.append('fileName', `_Consent_Form.${extension}`); 

        try {
            const response = await axios.post('http://127.0.0.1:5000/uploadCustomerConsentForm', formData, {
                headers: {
                'Content-Type': 'multipart/form-data',
                },
            });
            console.log("This is the response")
            console.log(response)

             console.log("result.data.status: " + response.data.status)
            if (response.data.status == "Success") {
                alert(`${file.name} uploaded successfully`);
                message.success(`${file.name} uploaded successfully`);
            } else {
                message.error(`Failed to upload ${file.name}`);
            }
            fetchConsentForm();
        } catch (error) {
            console.error(error);
            message.error(`Error uploading file: ${file.name}`);
            alert(`Error uploading file: ${file.name}`)
        }

        return false;
    };

    function getUserAccess(){
        if (userLoginDetails && Object.keys(userLoginDetails).length === 0){
            return "Guest";
        }

        return userLoginDetails.role;
    }


    return isLoading ?  
    (<Loading/>)
    
    :(
        <>
            {console.log("renderrrrrrr")}
            <div style={{ padding: 20 }}>
            <div style={{display:'flex', alignItems:'center'}}>
                <h1 style={{fontSize:"28px"}}>Customer Details</h1>

                {
                    getUserAccess() == "Admin" &&
                    <div className='flex'>
                        <SizedBox width={50}></SizedBox>
                        <StandardButton onClick={() => navigate(`/editCustomerDetails/${id}`)} label="Edit"></StandardButton>
                    </div>
                }

            </div>

            <Descriptions
            title="Customer Information"
            bordered
            column={2} 
            layout="horizontal"
            labelStyle={{ fontWeight: 'bold' }}
            >
                <Descriptions.Item label="Customer ID" >
                    {customerData.customerId ?? "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Old Customer ID">
                    {customerData.oldCustomerId ?? "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Name" span={2}>
                    {customerData.customerName ?? "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Email" span={2}>
                    {customerData.email ?? "-"}
                </Descriptions.Item>
                <Descriptions.Item label="IC" span={1}>
                    {customerData.ic ?? "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Gender" span={1}>
                    {customerData.gender ?? "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Race" span={1}>
                    {customerData.race ?? "-"}
                </Descriptions.Item>

                <Descriptions.Item label="Handphone" span={1}>
                    {customerData.handphone ?? "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Instagram" span={1}>
                    {customerData.instagram ?? "-"}
                </Descriptions.Item>
                <Descriptions.Item label="WeChat" span={1}>
                    {customerData.wechat ?? "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Address" span={3}>
                    {customerData.address ?? "-"}
                </Descriptions.Item>
                <Descriptions.Item label="How did you get to know our center?" span={2}>
                    {customerData.howDidYouFindUs ?? "-"}
                </Descriptions.Item>
            </Descriptions>

             <div style={{height:"20px"}}/>


            <Descriptions
                title="Medical Information"
                bordered
                column={2}
                layout="horizontal"
                labelStyle={{ fontWeight: 'bold' }}
            >
                <Descriptions.Item label="Height" span={1}>
                    {customerData.height ? `${customerData.height} cm` : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Weight" span={1}>
                    {customerData.weight ? `${customerData.weight} kg` : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Blood Type" span={1}>
                    {customerData.bloodType ?? "-"}
                </Descriptions.Item>
            </Descriptions>
            <div style={{height:"20px"}}/>
            <div>
                {customerHasConsentForm ? 
                <div style={{display:"flex"}}>
                    <StandardButton onClick={openConsentForm} label="View Consent Form"/>
                    <div style={{width:"20px"}}/>
                     <Upload beforeUpload={handleUpload} showUploadList={false}>
                        <StandardButton label="Update Consent Form" />
                    </Upload>   
                </div>
                :
                 <div>
                    <Upload beforeUpload={handleUpload} showUploadList={false}>
                        <StandardButton label="Upload Consent Form" />
                    </Upload>                        
                 </div>
                }
            </div>
            <hr style={{backgroundColor:"#d9d9d9",color:"#d9d9d9", height:"1px", marginInline:"10px", marginTop:"30px"}}></hr>

            <div className='flex w-full justify-between items-center pt-5 mb-10'>
                <h1 style={{fontSize:"28px"}}>Conditions</h1>
                <div>
                    <StandardButton label="Add Condition" onClick={showModal}></StandardButton>
                </div>
            </div>

            {/* To render condition card */}

            <Flex wrap gap="medium">
                {
                
                
                customerConditions.map((condition) => (
                    <Card 
                        title={condition.conditionDate} 
                        extra={renderViewCondition(condition)} 
                        style={{ 
                            width: 350,
                            marginInline: "10px",
                            marginTop: "10px",
                        }}
                        hoverable
                    >   

                        {condition.undergoingTreatment && 
                            <span class="inline-flex items-center bg-red-200 text-red-500 text-xs font-medium px-2.5 py-0.5 rounded-full m-0">
                                <span class="w-2 h-2 me-1 bg-red-500 rounded-full mt-0"></span>
                                    undergoing treatment
                            </span>
                        }    
                        <div style={{marginBottom:"10px"}}>
                            <p>{condition.conditionDescription}</p>
                        </div>
                                        
                    </Card>
                ))}
            </Flex>

            </div>   


            <Modal
                title="Add Condition"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isAddConditionModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Row>
                    <Col span={24}>
                        <p>Condition Description</p>
                    </Col>
                    <Col span={24}>
                        <TextArea 
                            value={text}
                            ref={textAreaRef} 
                            rows={5} 
                            placeholder={`Max character is ${MAXIMUM_CHARACTER_COUNT}` }
                            maxLength={MAXIMUM_CHARACTER_COUNT} 
                            onChange={conditionDescriptionTextBoxOnChange}
                            />
                        <p className={`text-end ${characterCount >=MAXIMUM_CHARACTER_COUNT && "text-red-500"}`}>{characterCount}/{MAXIMUM_CHARACTER_COUNT}</p>
                    </Col>
                </Row>
            </Modal>
            
        </>
         
    ) 
}

export default CustomerDetails