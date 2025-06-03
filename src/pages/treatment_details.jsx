import { Table } from 'antd';
import React, { useEffect,useState } from 'react'
import { useParams } from 'react-router-dom';
import Loading from '../components/loading';

const TreatmentDetailsView = () => {
    const { treatmentID } = useParams();
    const [treatmentData, setTreatmentData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const revisionHistoryColumns =[
        {
            title: 'Revision Date',
            dataIndex: 'treatmentDate',
            key: 'treatmentDate',
        },
        {
            title: 'Description',
            dataIndex: 'treatmentDescription',
            key: 'treatmentDescription',
        },{
            title: 'Pain Level',
            dataIndex: 'painLevel',
            key: 'painLevel',
        },{
            title: 'Sore Level',
            dataIndex: 'soreLevel',
            key: 'soreLevel',
        },{
            title: 'Tense Level',
            dataIndex: 'tenseLevel',
            key: 'tenseLevel',
        },{
            title: 'Numb Level',
            dataIndex: 'numbLevel',
            key: 'numbLevel',
        },


    ]
    const fetchTreatmentDetails = async () => {
        try {
            console.log(`awdaw: http://127.0.0.1:5000/treatmentDetails/${treatmentID}`, )
            const response = await fetch(`http://127.0.0.1:5000/treatmentDetails/${treatmentID}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setTreatmentData(data);
            setLoading(false);
        } catch (error) {
            alert('Error fetching treatment details: ', error);
        }
    }

    useEffect(() => {
        fetchTreatmentDetails();
    },[]);

    return loading? <Loading></Loading> : (
        <div>
            <div>
                <h1 style={{fontSize:"28px"}}>Treatment Details</h1>
                <div className='pl-5'>
                    <p>Create Date: {treatmentData.treatmentDetails.treatmentDate}</p>
                    <p>Description: {treatmentData.treatmentDetails.treatmentDescription}</p>
                    <p>Pain Level: {treatmentData.treatmentDetails.painLevel}</p>
                    <p>Tense Level: {treatmentData.treatmentDetails.tenseLevel}</p>
                    <p>Sore Level: {treatmentData.treatmentDetails.soreLevel}</p>
                    <p>Numb Level: {treatmentData.treatmentDetails.numbLevel}</p>
                </div>

            </div>



            <div className='mt-10 mb-5'>
                <h1 style={{fontSize:"28px"}}>Revision History</h1>
            </div>
            <Table
                dataSource={treatmentData.treatmentRevision}
                columns={revisionHistoryColumns}
                rowKey="treatmentDate"
                pagination={false}>
            </Table>

        </div>
    )
}

export default TreatmentDetailsView