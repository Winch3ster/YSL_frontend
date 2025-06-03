import React, { useEffect,useState,useRef   } from 'react'
import { useParams, useNavigate  } from 'react-router-dom';
import Loading from '../components/loading';
import StandardButton from '../components/standard_button';
import {Card, Flex, Modal, Row, Col } from 'antd';
import TextArea from 'antd/es/input/TextArea'

const CustomerDetails = () => {
    const MAXIMUM_CHARACTER_COUNT = 300;
    const { id } = useParams();
    const navigate = useNavigate();
    const [customerData, setCustomerData] = useState(null);
    const [customerConditions, setCustomerConditions] = useState([]);
    const [isAddConditionModalOpen, setIsAddConditionModalOpen] = useState(false);
    const textAreaRef = useRef(null);
    const [characterCount, setCharacterCount] = useState(0);
    const [text, setText] = useState('');


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
            }
            const data = await response.json();
            setCustomerConditions(data);
            console.log("Customer Conditions:", data);
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

    
    const renderViewCondition = (condition) => {
        return (
            <div onClick={() => navigateToConditionDetails(condition)}>
                <p className='text-blue-500'>View</p>
            </div>
        )
    }

    useEffect(() => {
        fetchCustomerDetails();
        fetchConditions();
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
                undergoingTreatment: false, // Default value, can be changed later
             }), // POST body
        });

        const result = await response.json();
        if (response.ok) {
            fetchCustomerDetails();
            fetchConditions();
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


  


    return customerData ?  (
        <>
            <div style={{ padding: 20 }}>
            <div>
                <h1 style={{fontSize:"28px"}}>Customer Details</h1>
            </div>

            <div className='flex w-8/12 justify-between items-center pt-5'>
                <div>
                    <p>Customer ID: {customerData.customerId ?? "-"}</p>
                    <p>Name: {customerData.customerName ?? "-"}</p>
                    <p>Email: {customerData.email ?? "-"}</p>
                    <p>IC: {customerData.ic ?? "-"}</p>
                    <p>Gender: {customerData.gender ?? "-"}</p>

                </div>

                <div>
                    <p>Address: {customerData.address ?? "-"}</p>
                    <p>Handphone: {customerData.handphone ?? "-"}</p>
                    <p>Instagram: {customerData.instagram ?? "-"}</p>
                    <p>How did you get know our center?: {customerData.howDidYouFindUs ?? "-"}</p>
                </div>
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
                {customerConditions.map((condition) => (
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
                title="Basic Modal"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isAddConditionModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Row>
                    <Col span={24}>
                        <p>Treatment Description</p>
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
         
    ) : <Loading/>
}

export default CustomerDetails