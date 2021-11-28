import React, { useState } from 'react';
import { Tooltip, Menu, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import vietnam from '../../assets/vietnam.svg';
import english from '../../assets/english.svg';
import user from '../../static/web/images/user.svg';
import HeaderDropdown from '../HeaderDropdown/index';
import HealthFacilityUserSelect from '../Common/HealthFacilityUserSelect';
import './index.scss';

const RightContentHeader = ({ localLanguage, changeLanguage, intl }) => {
  const [visiblePlace, setVisiblePlace] = useState(false);
  const username = localStorage.getItem('username');
  const healthFacilityId = localStorage.getItem('healthFacilityId');

  const logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userGroupId');
    localStorage.removeItem('id');
    localStorage.removeItem('healthFacilityId');
    window.location = '/';
  };
  const handleSelectHealthFacility = (id) => {
    localStorage.setItem('healthFacilityId', id);
    window.location = '/dashboard';
  };
  const menu = (
    <Menu className="menu" selectedKeys={[]}>
      <div className="menuAvatar">
        <Avatar
          size={64}
          className="avatar"
          src={user}
          style={{ border: '1px solid gray' }}
          alt="avatar"
        />
        <p style={{ margin: '10px 0' }}>{username || ''}</p>
      </div>
      <Menu.Item key="userinfo">
        <Link to="/account-config">
          <i className="fas fa-cog" />
          &nbsp; {intl.formatMessage({ id: 'app.title.accountSettings' })}
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={logOut}>
        <i className="fas fa-sign-out-alt" />
        &nbsp; {intl.formatMessage({ id: 'app.login.list.title.yes' })}
      </Menu.Item>
    </Menu>
  );

  return (
    <React.Fragment>
      {!visiblePlace ? (
        <Tooltip title={intl.formatMessage({ id: 'app.title.changePlace' })}>
          <i
            className="fas fa-map-marker-alt"
            onClick={() => setVisiblePlace(!visiblePlace)}
            style={{ color: '#fff', fontSize: '16px', cursor: 'pointer' }}
          />
        </Tooltip>
      ) : (
        <i
          className="fas fa-map-marker-alt"
          onClick={() => setVisiblePlace(!visiblePlace)}
          style={{ color: '#fff', fontSize: '16px', cursor: 'pointer' }}
        />
      )}
      &nbsp;&nbsp;
      <HealthFacilityUserSelect
        status={visiblePlace}
        placeholder={intl.formatMessage({ id: 'app.title.selectPlace' })}
        onChange={(value) => handleSelectHealthFacility(value)}
        value={Number(healthFacilityId)}
      />
      &nbsp;&nbsp;
      <Tooltip
        placement="bottomRight"
        title={intl.formatMessage({ id: 'app.common.switch.lang' })}
      >
        <img
          src={localLanguage === 'en-US' ? english : vietnam}
          alt=""
          className="language-icon"
          onClick={() => changeLanguage()}
          style={{ marginRight: 10 }}
        />
      </Tooltip>
      <Tooltip placement="bottomRight" title={username || ''}>
        <HeaderDropdown overlay={menu} trigger={['click']}>
          <span
            style={{ cursor: 'pointer', marginBottom: 5 }}
            className="action account"
          >
            <Avatar className="avatar" src={user} alt="avatar" />
          </span>
        </HeaderDropdown>
      </Tooltip>
    </React.Fragment>
  );
};

export default RightContentHeader;
