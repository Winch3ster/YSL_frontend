import { Col, Row, Dropdown, Space, Typography,Select, Checkbox,ConfigProvider, DatePicker, } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, {useEffect, useState} from 'react'
import { DownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import StandardButton from '../components/standard_button';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/loading';


const EditTreatmentView = () => {
    const { treatmentID } = useParams();

    const navigate = useNavigate();
    const [painLevel, setPainLevel] = useState(0);
    const [numbLevel, setNumbLevel] = useState(0);
    const [tenseLevel, setTenseLevel] = useState(0);
    const [soreLevel, setSoreLevel] = useState(0);
    const [autoTime, setAutoTime] = useState(false);

    const [date, setDate] = useState(dayjs('2015-01-01', 'YYYY-MM-DD'));
    const [treatmentDescription, setTreatmentDescription] = useState('');

    const [loading, setLoading] = useState(true);
    const [conditionID, setConditionID] = useState(null);

    const levels = Array.from({ length: 10 }, (_, i) => ({
        key: (i + 1).toString(),
        label: (i + 1).toString(),
    }));

    const handleAutoTimeCheck = (e) => {
        setAutoTime(e.target.checked);
    }

    const onChange = (_, dateStr) => {
        console.log('onChange:', dateStr);
        setDate(dateStr);
    };


    function handleTreatmentInputField(e) {
        setTreatmentDescription(e.target.value);
    }
    const handleEditTreatment = async() => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/editTreatment/${treatmentID}`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ 
                    conditionId: conditionID,
                    treatmentDescription: treatmentDescription,
                    numbLevel: numbLevel,
                    painLevel: painLevel,
                    soreLevel: soreLevel,
                    tenseLevel: tenseLevel,
                    treatmentDate: date,
                }), // POST body
            });

            const result = await response.json();

            if (result.Status === 'Success') {
                alert('Treatment editted successfully!');
                navigate(-1); // Navigate back to the previous page
            } else if (result.Status === 'Error') {
                alert(response.message || 'Failed to edit treatment.');
            }
        } catch (err) {
            alert('Error connecting to the server.');
            console.error(err);
        }
    }

    const fetchTreatmentDetails = async () => {
        try {
            console.log(`awdaw: http://127.0.0.1:5000/treatmentDetails/${treatmentID}`, )
            const response = await fetch(`http://127.0.0.1:5000/treatmentDetails/${treatmentID}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            prepopulateFields(data);
            setLoading(false);
        } catch (error) {
            alert('Error fetching treatment details: ', error);
        }
    }

    function prepopulateFields(treatmentData) {
        console.log("Prepopulating fields with data:", treatmentData);
        setConditionID(treatmentData.treatmentDetails.conditionID || null);
        setPainLevel(treatmentData.treatmentDetails.painLevel || 0);
        setNumbLevel(treatmentData.treatmentDetails.numbLevel || 0);
        setSoreLevel(treatmentData.treatmentDetails.soreLevel || 0);
        setTenseLevel(treatmentData.treatmentDetails.tenseLevel || 0);
        setTreatmentDescription(treatmentData.treatmentDetails.treatmentDescription || '');
        setDate(dayjs(treatmentData.treatmentDetails.treatmentDate || '2025-01-01', 'YYYY-MM-DD'));
    }


    useEffect(() => {
        fetchTreatmentDetails();
    }, []);

    return loading ?  <Loading></Loading>:(
        <div>
            <h1 style={{fontSize:"28px"}}>Add Treatment</h1>

            <div width="80%" className='mx-10 mt-5'>
                <Row>
                    <Col span={6}>
                        <p>Treatment Description</p>
                    </Col>
                    <Col span={18}>
                        <TextArea value={treatmentDescription} onChange={handleTreatmentInputField} rows={5} placeholder="maxLength is 500" maxLength={500} />
                    </Col>
                </Row>


                <Row className='mt-5'>
                    <Col span={6}>
                        <p>Pain Level</p>
                    </Col>
                    <Col span={18}>
                        <Select
                            defaultValue={painLevel}
                            placeholder="0"
                            onChange={(value) => setPainLevel(value)}
                            style={{ width: 200 }}
                            >
                                {levels.map((option) => (
                                    <Select.Option key={option.key} value={option.key}>
                                        {option.label}
                                    </Select.Option>
                            ))}
                        </Select>
                    </Col>
                </Row>

                <Row className='mt-5'>
                    <Col span={6}>
                        <p>Numb Level</p>
                    </Col>
                    <Col span={18}>
                        <Select
                        defaultValue={numbLevel}
                            placeholder="0"
                            onChange={(value) => setNumbLevel(value)}
                            style={{ width: 200 }}
                            >
                                {levels.map((option) => (
                                    <Select.Option key={option.key} value={option.key}>
                                        {option.label}
                                    </Select.Option>
                            ))}
                        </Select>
                    </Col>
                </Row>

                <Row className='mt-5'>
                    <Col span={6}>
                        <p>Sore Level</p>
                    </Col>
                    <Col span={18}>
                        <Select
                            defaultValue={soreLevel}
                            placeholder="0"
                            onChange={(value) => setSoreLevel(value)}
                            style={{ width: 200 }}
                            >
                                {levels.map((option) => (
                                    <Select.Option key={option.key} value={option.key}>
                                        {option.label}
                                    </Select.Option>
                            ))}
                        </Select>
                    </Col>
                </Row>


                <Row className='mt-5'>
                    <Col span={6}>
                        <p>Tense Level</p>
                    </Col>
                    <Col span={18}>
                        <Select
                            defaultValue={tenseLevel}
                            placeholder="0"
                            onChange={(value) => setTenseLevel(value)}
                            style={{ width: 200 }}
                            >
                                {levels.map((option) => (
                                    <Select.Option key={option.key} value={option.key}>
                                        {option.label}
                                    </Select.Option>
                            ))}
                        </Select>
                    </Col>
                </Row>


                
                <Row className='mt-5'>
                    <Checkbox onChange={handleAutoTimeCheck}>Set current system time</Checkbox>
                </Row>

                {
                    !autoTime && (
                        <Row className='mt-5'>
                            <Col span={6}>
                                <p>Treatment Date</p>
                            </Col>
                            <Col span={18}>
                                <DatePicker defaultValue={date} showTime onChange={onChange} />
                            </Col>
                        </Row>
                    )
                }
            </div>

            <Row className='mt-10 flex justify-end'>
                <StandardButton label="Cancel" onClick={() =>  navigate(-1)} danger={true}></StandardButton>
                <div style={{width:"10px"}}></div>
                <StandardButton label="Submit" onClick={handleEditTreatment}></StandardButton>
            </Row>
        </div>
    )
}

export default EditTreatmentView