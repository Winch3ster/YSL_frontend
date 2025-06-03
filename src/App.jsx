import './App.css'
import Header from './components/header'
import AddTreatmentView from './pages/add_treatment';
import ConditionDetails from './pages/condition_details';
import CustomerDetails from './pages/customer_details';
import Dashboard from './pages/dashboard'
import { Routes, Route } from 'react-router-dom';
import SignInView from './pages/sign_in';
import TreatmentDetailsView from './pages/treatment_details';
import EditTreatmentView from './pages/edit_treatment';

function App() {

  return (

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
              </Routes>
        </div>

      </div>
  )
}

export default App
