import { Col, Row, Dropdown, Space, Typography,Select, Checkbox,ConfigProvider, DatePicker, } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, {useState} from 'react'
import { DownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import StandardButton from '../components/standard_button';
import { useNavigate, useParams } from 'react-router-dom';


const AddTreatmentView = () => {
    const { conditionID } = useParams();

    const navigate = useNavigate();
    const [painLevel, setPainLevel] = useState(0);
    const [numbLevel, setNumbLevel] = useState(0);
    const [tenseLevel, setTenseLevel] = useState(0);
    const [soreLevel, setSoreLevel] = useState(0);
    const [autoTime, setAutoTime] = useState(false);

    const [date, setDate] = useState(dayjs('2025-01-01', 'YYYY-MM-DD'));
    const [treatmentDescription, setTreatmentDescription] = useState('');

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
    const handleAddTreatment = async() => {
        try {
            const response = await fetch('http://127.0.0.1:5000/addTreatment', {
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
                alert('New treatment added successfully!');
                navigate(-1); // Navigate back to the previous page
            } else if (result.Status === 'Error') {
                alert(response.message || 'Failed to add treatment.');
            }
        } catch (err) {
            alert('Error connecting to the server.');
            console.error(err);
        }
    }

    return (
        <div>
            <h1 style={{fontSize:"28px"}}>Add Treatment</h1>

            <div width="80%" className='mx-10 mt-5'>
                <Row>
                    <Col span={6}>
                        <p>Treatment Description</p>
                    </Col>
                    <Col span={18}>
                        <TextArea onChange={handleTreatmentInputField} rows={5} placeholder="maxLength is 500" maxLength={500} />
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
                                <DatePicker defaultValue={dayjs('2015-01-01', 'YYYY-MM-DD')} showTime onChange={onChange} />
                            </Col>
                        </Row>
                    )
                }

            </div>

            <Row className='mt-10 flex justify-end'>
                <StandardButton label="Cancel" onClick={() =>  navigate(-1)} danger={true}></StandardButton>
                <div style={{width:"10px"}}></div>
                <StandardButton label="Add Treatment" onClick={handleAddTreatment}></StandardButton>
            </Row>
        </div>
    )
}

export default AddTreatmentView