import React from 'react'
import StandardButton from './standard_button'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate()
  return (
    <div>
      <div className=' w-full h-16 flex items-center justify-between px-4'>
        <div onClick={() => {navigate('/')}} style={{cursor:"pointer"}}>YSL Management Dashboard</div>

        {/* Action buttons*/}
        <div>
          <StandardButton label="Sign In" onClick={() => {navigate('/signIn/')}}></StandardButton>    
        </div>
       
    </div>
         <hr style={{backgroundColor:"#d9d9d9",color:"#d9d9d9", height:"1px", marginInline:"10px"}}></hr>
    </div>
    
  )
}

export default Header