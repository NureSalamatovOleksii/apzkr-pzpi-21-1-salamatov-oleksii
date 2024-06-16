import React, { Component } from 'react';
import { Container } from 'reactstrap';
import NavMenu from './NavMenu';
import LogIn from '../pages/LogIn';
import App from '../App';
import Footer from './Footer';

export class Layout extends Component {
  
  static displayName = Layout.name;

  constructor(props) {
    super(props);

    this.state = 0;
    // this.state = {
    //   refreshKey: 0,
    //   state: 0
    // };
  }

  static refreshComp = () => {
    //console.log(LogIn.authorized);
    window.location.reload();

    // this.setState((prevState) => ({
    //   refreshKey: prevState.refreshKey + 1,
    // }));
  }

  render() {

    return (
      <div>
        {/* {localStorage.getItem('authorized') != 'true' && ( */}
          <NavMenu />
        {/* )} */}
        {/* {localStorage.getItem('authorized') == 'true' && (
          <NavMenuUpd />
        )} */}
        {/*<NavMenu />*/}
        <Container tag="main">
          {this.props.children}
        </Container>
        <Footer />
      </div>
    );
  }
}
