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

import PageNotFound from '../pages/ErrorsPage/PageNotFound';

const AppRoutes = ({ headerPage }) => {
  const isMobile = window.innerWidth <= 768 ? true : false;
  const intl = useIntl();

  return (
    <>
      <Switch>
        <Route exact path="/">
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
        <Route path="/account-config">
          <Account isMobile={isMobile} intl={intl} headerPage={headerPage} />
        </Route>
        <Route path="*" component={PageNotFound} />
      </Switch>
    </>
  );
};

export default AppRoutes;
