import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import LoginRoutes from './routes/LoginRoutes';
import LayoutPage from './layouts/LayoutPage';

import Vietnamese from './lang/vi';
import English from './lang/en';

const App = () => {
  const dispatch = useDispatch();
  const [checkLogin, setCheckLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkLoading, setCheckLoading] = useState(true);
  const [localLanguage, setLocalLanguage] = useState(
    localStorage.getItem('lang')
  );
  const healthFacilityId = localStorage.getItem('healthFacilityId');

  if (!localLanguage) {
    localStorage.setItem('lang', 'vi-VI');
    setLocalLanguage('vi-VI');
  }

  let lang;
  if (localLanguage === 'en-US') {
    lang = English;
  } else {
    lang = Vietnamese;
  }

  const token = localStorage.getItem('token');

  useEffect(() => {
    setLoading(true);
    dispatch({
      type: 'auth/verifyToken',
      payload: token,
      callback: (res) => {
        if (res?.success) {
          setCheckLogin(true);
          getHealthFacility();
        } else {
          setCheckLogin(false);
        }
        setLoading(false);
        setCheckLoading(false);
      },
    });
  }, [token]);

  const getHealthFacility = () => {
    dispatch({
      type: 'healthFacility/getOne',
      payload: {
        id: healthFacilityId,
      },
    });
  };

  return (
    <IntlProvider locale={localLanguage} messages={lang}>
      <Router>
        <Spin spinning={loading}>
          {checkLogin
            ? !checkLoading && (
                <>
                  <LayoutPage
                    localLanguage={localLanguage}
                    setLocalLanguage={setLocalLanguage}
                  />
                </>
              )
            : !checkLoading && (
                <>
                  <Redirect to="/" />
                  <LoginRoutes />
                </>
              )}
        </Spin>
      </Router>
    </IntlProvider>
  );
};

export default App;
