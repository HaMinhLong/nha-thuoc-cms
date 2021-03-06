import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { useIntl } from 'react-intl';
import Home from '../pages/Dashboard/Home';
import Menu from '../pages/Menu/Menu';
import UserGroup from '../pages/UserGroup/UserGroup';
import User from '../pages/User/User';
import Config from '../pages/Config/Config';
import UserGroupRole from '../pages/UserGroupRole/UserGroupRole';
import Account from '../pages/Account/Account';
import Province from '../pages/Province/Province';
import District from '../pages/District/District';
import Ward from '../pages/Ward/Ward';
import PaymentMethod from '../pages/PaymentMethod/PaymentMethod';
import MedicalFacilityGroup from '../pages/MedicalFacilityGroup/MedicalFacilityGroup';
import Specialist from '../pages/Specialist/Specialist';
import MedicalFacility from '../pages/MedicalFacility/MedicalFacility';
import Place from '../pages/Place/Place';
import HealthFacility from '../pages/HealthFacility/HealthFacility';
import SelectHealthFacility from '../pages/SelectHealthFacility/SelectHealthFacility';
import SupplierGroup from '../pages/SupplierGroup/SupplierGroup';
import Supplier from '../pages/Supplier/Supplier';
import ProducerGroup from '../pages/ProducerGroup/ProducerGroup';
import Producer from '../pages/Producer/Producer';
import CustomerGroup from '../pages/CustomerGroup/CustomerGroup';
import Customer from '../pages/Customer/Customer';
import Medicine from '../pages/Medicine/Medicine';
import MedicineType from '../pages/MedicineType/MedicineType';
import Apothecary from '../pages/Apothecary/Apothecary';
import Packages from '../pages/Packages/Packages';
import Unit from '../pages/Unit/Unit';
import Warehouse from '../pages/Warehouse/Warehouse';
import PrintForm from '../pages/PrintForm/PrintForm';
import ClinicServicePackage from '../pages/ClinicServicePackage/ClinicServicePackage';
import ClinicService from '../pages/ClinicService/ClinicService';
import Receipt from '../pages/Receipt/Receipt';
import MedicineIssue from '../pages/MedicineIssue/MedicineIssue';
import Consumable from '../pages/Consumable/Consumable';
import MedicineTransfer from '../pages/MedicineTransfer/MedicineTransfer';
import MedicalRegister from '../pages/MedicalRegister/MedicalRegister';
import ClinicReceipt from '../pages/ClinicReceipt/ClinicReceipt';
import ClinicResult from '../pages/ClinicResult/ClinicResult';
import ClinicPrescription from '../pages/ClinicPrescription/ClinicPrescription';
import DoctorReport from '../pages/ClinicReport/DoctorReport';
import CustomerReport from '../pages/MedicineReport/CustomerReport';
import EmployeeReport from '../pages/MedicineReport/EmployeeReport';
import SupplierReport from '../pages/MedicineReport/SupplierReport';
import ExpiredMedicine from '../pages/MedicineReport/ExpiredMedicine';
import ExpiredMedicineV2 from '../pages/MedicineReport/ExpiredMedicineV2';
import MedicineReport from '../pages/MedicineReport/MedicineReport';
import ClinicCustomerReport from '../pages/ClinicReport/ClinicCustomerReport';

import PageNotFound from '../pages/ErrorsPage/PageNotFound';

const AppRoutes = ({ headerPage }) => {
  const isMobile = window.innerWidth <= 768 ? true : false;
  const intl = useIntl();

  return (
    <>
      <Switch>
        <Route exact path="/">
          <SelectHealthFacility
            isMobile={isMobile}
            intl={intl}
            headerPage={headerPage}
          />
        </Route>
        <Route exact path="/dashboard">
          <Home isMobile={isMobile} intl={intl} headerPage={headerPage} />
        </Route>
        <Route path="/menu/:id">
          <Menu isMobile={isMobile} intl={intl} headerPage={headerPage} />
        </Route>
        <Route path="/user-group/:id">
          <UserGroup isMobile={isMobile} intl={intl} headerPage={headerPage} />
        </Route>
        <Route path="/user/:id">
          <User isMobile={isMobile} intl={intl} headerPage={headerPage} />
        </Route>
        <Route path="/config/:id">
          <Config isMobile={isMobile} intl={intl} headerPage={headerPage} />
        </Route>
        <Route path="/province/:id">
          <Province isMobile={isMobile} intl={intl} headerPage={headerPage} />
        </Route>
        <Route path="/district/:id">
          <District isMobile={isMobile} intl={intl} headerPage={headerPage} />
        </Route>
        <Route path="/ward/:id">
          <Ward isMobile={isMobile} intl={intl} headerPage={headerPage} />
        </Route>
        <Route path="/payment-method/:id">
          <PaymentMethod
            isMobile={isMobile}
            intl={intl}
            headerPage={headerPage}
          />
        </Route>
        <Route path="/medical-facility-group/:id">
          <MedicalFacilityGroup
            isMobile={isMobile}
            intl={intl}
            headerPage={headerPage}
          />
        </Route>
        <Route path="/specialist/:id">
          <Specialist isMobile={isMobile} intl={intl} headerPage={headerPage} />
        </Route>
        <Route path="/health-facility/:id">
          <HealthFacility
            isMobile={isMobile}
            intl={intl}
            headerPage={headerPage}
          />
        </Route>
        <Route path="/medical-facility/:id">
          <MedicalFacility
            isMobile={isMobile}
            intl={intl}
            headerPage={headerPage}
          />
        </Route>
        <Route path="/place/:id">
          <Place isMobile={isMobile} intl={intl} headerPage={headerPage} />
        </Route>
        <Route path="/grant-permissions/:id">
          <UserGroupRole
            isMobile={isMobile}
            intl={intl}
            headerPage={headerPage}
          />
        </Route>
        <Route path="/supplier-group/:id">
          <SupplierGroup
            isMobile={isMobile}
            intl={intl}
            headerPage={headerPage}
          />
        </Route>
        <Route path="/supplier/:id">
          <Supplier isMobile={isMobile} intl={intl} headerPage={headerPage} />
        </Route>
        <Route path="/producer-group/:id">
          <ProducerGroup
            isMobile={isMobile}
            intl={intl}
            headerPage={headerPage}
          />
        </Route>
        <Route path="/producer/:id">
          <Producer isMobile={isMobile} intl={intl} headerPage={headerPage} />
        </Route>
        <Route path="/customer-group/:id">
          <CustomerGroup
            isMobile={isMobile}
            intl={intl}
            headerPage={headerPage}
          />
        </Route>
        <Route path="/customer/:id">
          <Customer isMobile={isMobile} intl={intl} headerPage={headerPage} />
        </Route>
        <Route path="/nt-medicine/:id">
          <Medicine isMobile={isMobile} intl={intl} headerPage={headerPage} />
        </Route>
        <Route path="/nt-medicine-type/:id">
          <MedicineType
            isMobile={isMobile}
            intl={intl}
            headerPage={headerPage}
          />
        </Route>
        <Route path="/nt-apothecary/:id">
          <Apothecary isMobile={isMobile} intl={intl} headerPage={headerPage} />
        </Route>
        <Route path="/nt-package/:id">
          <Packages isMobile={isMobile} intl={intl} headerPage={headerPage} />
        </Route>
        <Route path="/nt-unit/:id">
          <Unit isMobile={isMobile} intl={intl} headerPage={headerPage} />
        </Route>
        <Route path="/warehouse/:id">
          <Warehouse isMobile={isMobile} intl={intl} headerPage={headerPage} />
        </Route>
        <Route path="/print-form/:id">
          <PrintForm isMobile={isMobile} intl={intl} headerPage={headerPage} />
        </Route>
        <Route path="/clinic-service-package/:id">
          <ClinicServicePackage
            isMobile={isMobile}
            intl={intl}
            headerPage={headerPage}
          />
        </Route>
        <Route path="/clinic-service/:id">
          <ClinicService
            isMobile={isMobile}
            intl={intl}
            headerPage={headerPage}
          />
        </Route>
        <Route path="/nt-receipt/:id">
          <Receipt isMobile={isMobile} intl={intl} headerPage={headerPage} />
        </Route>
        <Route path="/nt-medicine-issue/:id">
          <MedicineIssue
            isMobile={isMobile}
            intl={intl}
            headerPage={headerPage}
          />
        </Route>
        <Route path="/nt-consumable/:id">
          <Consumable isMobile={isMobile} intl={intl} headerPage={headerPage} />
        </Route>
        <Route path="/nt-medicine-transfer/:id">
          <MedicineTransfer
            isMobile={isMobile}
            intl={intl}
            headerPage={headerPage}
          />
        </Route>
        <Route path="/pk-receipt/:id">
          <ClinicReceipt
            isMobile={isMobile}
            intl={intl}
            headerPage={headerPage}
          />
        </Route>
        <Route path="/pk-medical-register/:id">
          <MedicalRegister
            isMobile={isMobile}
            intl={intl}
            headerPage={headerPage}
          />
        </Route>
        <Route path="/pk-clinic-result/:id">
          <ClinicResult
            isMobile={isMobile}
            intl={intl}
            headerPage={headerPage}
          />
        </Route>
        <Route path="/pk-clinic-prescription/:id">
          <ClinicPrescription
            isMobile={isMobile}
            intl={intl}
            headerPage={headerPage}
          />
        </Route>
        <Route path="/clinic-doctor/:id">
          <DoctorReport
            isMobile={isMobile}
            intl={intl}
            headerPage={headerPage}
          />
        </Route>
        <Route path="/medicine-customer/:id">
          <CustomerReport
            isMobile={isMobile}
            intl={intl}
            headerPage={headerPage}
          />
        </Route>
        <Route path="/medicine-employee/:id">
          <EmployeeReport
            isMobile={isMobile}
            intl={intl}
            headerPage={headerPage}
          />
        </Route>
        <Route path="/medicine-supplier/:id">
          <SupplierReport
            isMobile={isMobile}
            intl={intl}
            headerPage={headerPage}
          />
        </Route>
        <Route path="/exipred-medicine/:id">
          <ExpiredMedicine
            isMobile={isMobile}
            intl={intl}
            headerPage={headerPage}
          />
        </Route>
        <Route path="/exipred-medicine-2/:id">
          <ExpiredMedicineV2
            isMobile={isMobile}
            intl={intl}
            headerPage={headerPage}
          />
        </Route>
        <Route path="/medicine-report/:id">
          <MedicineReport
            isMobile={isMobile}
            intl={intl}
            headerPage={headerPage}
          />
        </Route>
        <Route path="/clinic-customer/:id">
          <ClinicCustomerReport
            isMobile={isMobile}
            intl={intl}
            headerPage={headerPage}
          />
        </Route>

        <Route path="/account-config">
          <Account isMobile={isMobile} intl={intl} headerPage={headerPage} />
        </Route>
        <Route path="*" component={PageNotFound} />
      </Switch>
    </>
  );
};

export default AppRoutes;
