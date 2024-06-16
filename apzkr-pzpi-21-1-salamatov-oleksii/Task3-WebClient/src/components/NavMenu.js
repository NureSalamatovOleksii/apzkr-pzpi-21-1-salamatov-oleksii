import React, { Component } from 'react';
import { Button, Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { withTranslation } from 'react-i18next';

class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true,
      isVisible: false
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  toggleVisibility = () => {
    this.setState(prevState => ({
      isVisible: !prevState.isVisible
    }));
  };

  refresh() {
    localStorage.setItem('authorized', false);
    console.log(localStorage.getItem('token'));
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = "/";
  }

  render() {
    const { t } = this.props.i18n;

    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" container light>
          <img src="https://i.pinimg.com/originals/61/88/8d/61888d3723077d6eb5e4f76682689501.png" style={{ width: '23px' }} />
          <NavbarBrand tag={Link} to="/" className='ml-2'>{t('Smart Recycling')}</NavbarBrand>
          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
          <Collapse className="d-sm-inline-flex flex-sm-row-reverse mr-5" isOpen={!this.state.collapsed} navbar>
            <ul className="navbar-nav flex-grow">
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/">{t('home')}</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/collectionPoints">{t('ourPoints')}</NavLink>
              </NavItem>
              {localStorage.getItem('authorized') === 'true' && localStorage.getItem('role') === "Admin" && (
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/data">{t('data')}</NavLink>
                </NavItem>
              )}
            </ul>
          </Collapse>
          {localStorage.getItem('authorized') !== 'true' && (
            <Link to="/log-in-form">
              <button type="button" className="btn btn-outline-secondary mr-2">{t('Log in')}</button>
            </Link>
          )}
          {localStorage.getItem('authorized') !== 'true' && (
            <Link to="/sign-up-form">
              <button type="button" className="btn btn-secondary mr-2">{t('Sign up')}</button>
            </Link>
          )}
          {localStorage.getItem('authorized') === 'true' && (
            <div>
              <Dropdown>
                <Dropdown.Toggle variant="primary">
                  {t('me')}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/profile">{t('profile')}</Dropdown.Item>
                  <Dropdown.Item>{t('anotherAction')}</Dropdown.Item>
                  <Dropdown.Item onClick={this.refresh}>{t('logOut')}</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )}
        </Navbar>
      </header>
    );
  }
}

export default withTranslation()(NavMenu);
