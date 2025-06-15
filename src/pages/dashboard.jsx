import React, {useEffect, useState} from 'react'
import { AudioOutlined } from '@ant-design/icons';
import { Input, Space,Table,Tag  } from 'antd';
import { useNavigate } from 'react-router-dom';
import StandardButton from '../components/standard_button';
import SizedBox from '../components/sizedBox';
import Loading from '../components/loading';


const { Search } = Input;


const Dashboard = () => {

  const navigate = useNavigate();
  const [allCustomerData, setAllCustomerData] = useState([]);
  const [filteredCustomerData, setFilteredCustomerData] = useState([]);
  const [isLoading, setIsLoading] = useState(true)

  const onSearch = (value, _e, info) => {
    console.log(info === null || info === void 0 ? void 0 : info.source, value);
  }

  function onChange(e) {
    console.log("onChange", e.target.value);
    const value = e.target.value.toLowerCase();

    if(value === "") {
      setFilteredCustomerData(allCustomerData);
      return;
    }


    const filtered = allCustomerData.filter((item) => {
      // Check if search term matches any property (case insensitive)
      return (
        item.customerEmail.toLowerCase().includes(value) ||
        item.customerIC.toLowerCase().includes(value) ||
        item.customerName.toLowerCase().includes(value) ||
        item.userId.toLowerCase().includes(value)
      );
    });

    setFilteredCustomerData(filtered);  
  }

  const columns = [
    {
      title: 'Customer ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Customer IC',
      dataIndex: 'customerIC',
      key: 'customerIC',
    },
    {
      title: 'Name',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Email',
      key: 'customerEmail',
      dataIndex: 'customerEmail',
      
    },
  ];

   
    const fetchData = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setAllCustomerData(data);
            setFilteredCustomerData(data);
        } catch (error) {
            console.error('Error fetching customer data:', error);
        }
    };

    useEffect(() => async () => {
        //Get the user data from the API
        await fetchData();
        setIsLoading(false);
    }, []);

  return isLoading ? 
    <Loading/>
  : (
        <div>
            {/* Greetings*/}
            <div style={{fontSize:"16px"}}>Greeting! Welcome to YSL Management Dashboard</div>
            
              <div style={{width:"800px", marginTop:"20px", marginBottom:"30px", display: "flex"}}>  
                <Search
                  placeholder="Search for customer..."
                  allowClear
                  enterButton="Search"
                  size="large"
                  onSearch={onSearch}
                  onChange = {onChange}
                  style={{width:"400px"}}
                />
                <SizedBox width={50}></SizedBox>
                <StandardButton onClick={() => navigate('/addCustomer/')} label="Register Customer"  />
              </div>
              
        

              <Table 
                columns={columns} 
                dataSource={filteredCustomerData} 
                key={(record) => record.id}
                onRow={(record) => ({
                  onClick: () => {
                    navigate(`/customer/${record.userId}`);
                  },
                })}
              />;
            
        </div> 

    )
}

export default Dashboard