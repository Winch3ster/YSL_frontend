import React, { useEffect, useState  } from 'react'
import {Card, Flex} from 'antd';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Loading from '../components/loading';
import StandardButton from '../components/standard_button';

const ConditionDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [customerInfo, setCustomerInfo] = useState(null);
    const [conditionData, setConditionData] = useState(null);
    const [treatmentData, setTreatmentData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchConditionDetails = async () => {
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

    useEffect(() => async () => {
        await fetchConditionDetails();
        setConditionData(location.state?.condition);
        setCustomerInfo(location.state?.customerData);
        console.log("Condition Data:", location.state?.condition);
        console.log("Condition state:", location.state);
        setLoading(false);
    },[])

    console.log("Customer Info:", customerInfo);

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

    function viewTreatmentDetails(treatment) {
        console.log("Navigating to treatment details for ID:", treatment);
        // Navigate to the treatment details page
         navigate(`/treatmentDetails/${treatment.treatmentID}`);
    }

    return loading ? <Loading></Loading> : (
        <div className='p-10 pt-0'>
            <div>
                <h1 style={{fontSize:"28px"}}>Customer Info</h1>
                <div className='pl-5'>
                    <p>Customer ID: {customerInfo.customerId}</p>
                    <p>Customer Name: {customerInfo.customerName}</p>
                </div>
            </div>

            <div className='mt-5'>
                <h1 style={{fontSize:"28px"}}>Condition Info</h1>
                <div className='flex justify-start pl-5'>
                    <div>
                        <p>Description: {conditionData.conditionDescription} </p>
                        <p>Added Date: {conditionData.conditionDate}</p>
                        <p>Status: {conditionData.undergoingTreatment} </p>
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
    )
}

export default ConditionDetails