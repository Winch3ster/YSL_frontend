import React, {useContext} from 'react'
import StandardButton from './standard_button'
import { useNavigate } from 'react-router-dom'
import { AppContext } from "../App";
import { Popover,Avatar } from 'antd';
import SizedBox from './sizedBox';

const Header = () => {
  const navigate = useNavigate()
  const {  userLoginDetails, setUserLoginDetails } = useContext(AppContext);
  console.log("userLoginDetails")
  console.log(userLoginDetails);
  console.log("----------")

  function signOut(){
    setUserLoginDetails({});
    alert("Signed out");
  }
  const content = (
    <div className='block'>
      <StandardButton label="Admin" onClick={() => {navigate('/adminConfig/')}}></StandardButton>   
      <br></br> 
      <SizedBox height={10}></SizedBox>
      <StandardButton label="Sign out" onClick={signOut} danger={true}></StandardButton>   
    </div>
    );

  return (
    <div>
      <div className=' w-full h-16 flex items-center justify-between px-4'>
        <div onClick={() => {navigate('/')}} style={{cursor:"pointer"}}>YSL Management Dashboard</div>

        {/* Action buttons*/}
        <div>
          {(userLoginDetails && Object.keys(userLoginDetails).length === 0) ?
              <StandardButton label="Sign In" onClick={() => {navigate('/signIn/')}}></StandardButton>    

            :
            <Popover content={content} trigger="hover">
              <div className='flex'>
                <Avatar style={{ backgroundColor: '#7265e6', verticalAlign: 'middle', cursor:"pointer" }} size="large">
                  {userLoginDetails?.name[0] ?? ""}
                </Avatar>
              </div>
            </Popover>
        }
        </div>
       
    </div>
         <hr style={{backgroundColor:"#d9d9d9",color:"#d9d9d9", height:"1px", marginInline:"10px"}}></hr>
    </div>
    
  )
}

export default Header