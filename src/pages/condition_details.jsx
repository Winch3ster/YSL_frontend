import React, { useEffect, useState,useRef,useContext  } from 'react'
import {Card, Flex, Modal, Row, Col} from 'antd';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Loading from '../components/loading';
import StandardButton from '../components/standard_button';
import TextArea from 'antd/es/input/TextArea';
import { AppContext } from "../App";

const ConditionDetails = () => {
        const {  userLoginDetails, setUserLoginDetails } = useContext(AppContext);
    
    const MAXIMUM_CHARACTER_COUNT = 300;
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [customerInfo, setCustomerInfo] = useState(null);
    const [conditionData, setConditionData] = useState(null);
    const [treatmentData, setTreatmentData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editConditionModalOpen, setEditConditionModalOpen] = useState(false);
    const textAreaRef = useRef(null);
    const [characterCount, setCharacterCount] = useState(0);
    const [text, setText] = useState('');
    const [treatmentIsMarkedAsCompleted, setTreatmentIsMarkedAsCompleted] = useState(false);

    const fetchTreatmentsByCondition = async () => {
        try {
            console.log("Fetching condition details for ID:", id);
            console.log(`http://127.0.0.1:5000/treatments/${id}`)
            const response = await fetch(`http://127.0.0.1:5000/treatments/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setTreatmentData(data);
            console.log("Customer Conditions:", data);
        } catch (error) {
            console.error('Error fetching customer details:', error);
        }
    }

    const updateConditionDetails = async () => {
        try {

            const response = await fetch(`http://127.0.0.1:5000/editCondition/${id}`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ 
                    conditionId: id,
                    conditionDescription: text,
                    undergoingTreatment: treatmentIsMarkedAsCompleted,
                }), // POST body
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log("response from editing condition")
            console.log(response)
            setConditionData({...conditionData, conditionDescription:text, undergoingTreatment:treatmentIsMarkedAsCompleted})
            setEditConditionModalOpen(false);

        } catch (error) {
            console.error('Error updating condition details:', error);
        }
    }


    useEffect(() => async () => {
        await fetchTreatmentsByCondition();
        setConditionData(location.state?.condition);
        setCustomerInfo(location.state?.customerData);
        setTreatmentIsMarkedAsCompleted(location.state?.condition?.undergoingTreatment)
        setLoading(false);
    },[])

    function navigateToEditView(treatment) {
        console.log("Navigating to edit view for treatment ID:", treatment.treatmentID);
        // Navigate to the edit view page
        navigate(`/editTreatmentDetails/${treatment.treatmentID}`);
    }

    function navigateToAddTreatmentView(conditionID) {
        console.log("Navigating to add treatment");
        navigate(`/addTreatment/${conditionID}`)
        // Navigate to the add treatment page
        // navigate(`/addTreatment/${id}`, { state: { conditionData, customerInfo } });
    } 


    function renderCardActionButtons(treatment){
        return(
            <div className='flex justify-between items-center'>

                <div onClick={() => navigateToEditView(treatment)}>
                    <p className='text-blue-500'>Edit</p>
                </div>


                <div onClick={() => viewTreatmentDetails(treatment)}>
                    <p className='text-blue-500 ml-3'>View</p>
                </div>


            </div>
        )
    }



    function renderLevelsGridCell(label, value) {
        return (
            <div>
                <p className='text-center text-blue-500'>{label}</p>
                <p className='text-center'>{value}</p>
            </div>
        )
    }


    function openEditCoditionModal(){
        setText(conditionData.conditionDescription)
        setCharacterCount(conditionData.conditionDescription.length);
        setEditConditionModalOpen(true);
    }

    function handleOkEditCondition() {
        // Save the new condition data
        console.log("updating condition details")
        updateConditionDetails();

        //close the modal
    }
    function handleCancelEditCondition() {
        // Reset the condition data to the original state
        setEditConditionModalOpen(false);
    }

    function viewTreatmentDetails(treatment) {
        console.log("Navigating to treatment details for ID:", treatment);
        // Navigate to the treatment details page
         navigate(`/treatmentDetails/${treatment.treatmentID}`);
    }

    const conditionDescriptionTextBoxOnChange = (e) => {
        const value = e.target.value;
        if (value.length <= MAXIMUM_CHARACTER_COUNT) {
            setCharacterCount(value.length);
            setText(e.target.value)
        }
    }
    function getUserAccess(){
        if (userLoginDetails && Object.keys(userLoginDetails).length === 0){
            return "Guest";
        }

        return userLoginDetails.role;
    }


    return loading ? <Loading></Loading> : (
        <>
            <div className='p-10 pt-0'>
                <div>
                    <h1 style={{fontSize:"28px"}}>Customer Info</h1>
                    <div className='pl-5'>
                        <p>Customer ID: {customerInfo.customerId}</p>
                        <p>Customer Name: {customerInfo.customerName}</p>
                    </div>
                </div>

                <div className='mt-5'>
                    <div className='flex items-center'>
                        <h1 style={{fontSize:"28px", marginRight:"10px"}}>Condition Info</h1>
                        
                    {
                        getUserAccess() == "Admin" &&
                        <StandardButton label="Edit" onClick={openEditCoditionModal}></StandardButton>
                    }
                    
                    </div>

                    <div className='flex justify-start pl-5'>
                        <div>
                            <p>Description: {conditionData.conditionDescription} </p>
                            <p>Added Date: {conditionData.conditionDate}</p>
                            <p>Status: {
                            conditionData.undergoingTreatment ? 
                                <span class="inline-flex items-center bg-red-200 text-red-500 text-xs font-medium px-2.5 py-0.5 rounded-full m-0">
                                    <span class="w-2 h-2 me-1 bg-red-500 rounded-full mt-0"></span>
                                        undergoing treatment
                                </span>: 

                                <span class="inline-flex items-center bg-green-200 text-green-500 text-xs font-medium px-2.5 py-0.5 rounded-full m-0">
                                    <span class="w-2 h-2 me-1 bg-green-500 rounded-full mt-0"></span>
                                        Treated
                                </span>
                            }</p>
                        </div>
                        <div style={{width:"200px"}}></div>
                        <div style={{width:"250px", height:"250px"}} className='rounded-lg bg-gray-200'></div>
                        
                    </div>
                    
                </div>

                <div className='flex w-full justify-between items-center pt-5 mb-10'>
                    <h1 style={{fontSize:"28px"}}>Treatments</h1>
                    <div>
                        <StandardButton label="Add Treatment" onClick={() => navigateToAddTreatmentView(conditionData.conditionId)}></StandardButton>
                    </div>
                </div>


                <Flex wrap gap="medium" className='pl-5'>
                        {
                        treatmentData?.length === 0 ?
                        <p className='text-gray-500'>No treatments available for this condition.</p>
                        :
                        
                        treatmentData?.map((treatment) => (
                            <Card 
                                title={treatment.treatmentDate} 
                                extra={renderCardActionButtons(treatment)} 
                                style={{ 
                                    width: 450,
                                    marginInline: "10px",
                                }}
                                hoverable
                            >
                                <div className='flex justify-between'>
                                    <div>
                                        <p>{treatment.treatmentDescription}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 p-4">
                                        {renderLevelsGridCell("Pain", treatment.painLevel)}
                                        {renderLevelsGridCell("Sore", treatment.soreLevel)}
                                        {renderLevelsGridCell("Tense", treatment.tenseLevel)}
                                        {renderLevelsGridCell("Numb", treatment.numbLevel)}
                                    </div>
                                </div>
                            
                            </Card>
                        ))}
                    </Flex>
                </div>
            <Modal
                title="Edit Condition"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={editConditionModalOpen}
                onOk={handleOkEditCondition}
                onCancel={handleCancelEditCondition}
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


                <Row>
                    <div className='flex items-center'>
                        <p className='mr-5'>Undergoing Treatment</p>
                        <input 
                            type="checkbox" 
                            checked={treatmentIsMarkedAsCompleted} 
                            onChange={(e) => setTreatmentIsMarkedAsCompleted(e.target.checked)}
                        />
                    </div>
                    
                </Row>




            </Modal>
        </>
    )
}

export default ConditionDetails