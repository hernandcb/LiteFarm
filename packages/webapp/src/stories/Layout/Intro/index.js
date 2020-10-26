import React from 'react';
import styles from './layout.scss';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Navbar from '../../Navigation';
import Footer from '../../Footer';

const Layout = ({
  classes = { container: '', navbar: '', footer: '' },
  children,
  buttonGroup,
  isSVG,
  history,
  auth
}) => {
  return (
    <>
      <Navbar className={classes.navbar} history={history} auth={auth} />
      <div className={clsx(styles.container, isSVG && styles.svgContainer, classes.container)}>
        {children}
      </div>
      <Footer classes={classes.footer}>
        {buttonGroup}
      </Footer>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  buttonGroup: PropTypes.node,
  classes: PropTypes.exact({ container: PropTypes.string, navbar: PropTypes.string, footer: PropTypes.string }),
  isSVG: PropTypes.bool,
}

export default Layout;
