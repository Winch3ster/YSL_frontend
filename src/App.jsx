import './App.css'
import React, { createContext, useState } from 'react';
import Header from './components/header'
import AddTreatmentView from './pages/add_treatment';
import ConditionDetails from './pages/condition_details';
import CustomerDetails from './pages/customer_details';
import Dashboard from './pages/dashboard'
import { Routes, Route } from 'react-router-dom';
import SignInView from './pages/sign_in';
import TreatmentDetailsView from './pages/treatment_details';
import EditTreatmentView from './pages/edit_treatment';
import EditCustomerDetailsPage from './pages/edit_customer_details';
import AddCustomerDetailsPage from './pages/add_customer';

// Create the context
export const AppContext = createContext();

function App() {
  const [userLoginDetails, setUserLoginDetails] = useState({});

  return (
      <AppContext value={{ userLoginDetails, setUserLoginDetails }}>
        <div className='main-app-container'>
        <Header></Header>
        {/*Page content*/}
        <div style={{padding:"20px"}}>
            <Routes>
              <Route path="/" element={<Dashboard/>} />
              <Route path="/customer/:id" element={<CustomerDetails />} />
              <Route path="/condition/:id" element={<ConditionDetails />} />
              <Route path="/addTreatment/:conditionID" element={<AddTreatmentView />} />
              <Route path="/signIn/" element={<SignInView />} />
              <Route path="/treatmentDetails/:treatmentID" element={<TreatmentDetailsView />} />
              <Route path="/editTreatmentDetails/:treatmentID" element={<EditTreatmentView />} />
              <Route path="/editCustomerDetails/:customerID" element={<EditCustomerDetailsPage />} />
              <Route path="/addCustomer/" element={<AddCustomerDetailsPage />} />
            </Routes>
        </div>
      </div>
    </AppContext>
  )
}

export default App
