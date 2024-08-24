import React from 'react';
import { Redirect } from 'react-router-dom';
import User from '../../models/User';

const withAdminAuth = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      const isAdmin = User && User.role === 'admin';
      
      if (!isAdmin) {
        return <Redirect to="/login" />;
      }
      
      return <WrappedComponent {...this.props} />;
    }
  }
};

export default withAdminAuth;
