import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

function Header() {

  return (
    <Container>
      <Navbar>
        <Link style={{textDecoration: 'none'}} to="/">
          <Logo>
            <h3 style={{fontWeight: 200}}>SOC</h3> 
            <h3 style={{fontWeight: 600}}>PLANNER</h3>
          </Logo>
        </Link>
        
        <Navlinks>
            <StyledLink to="/">PLANNER</StyledLink>
            <StyledLink to="/showplans">SHOW PLANS</StyledLink>
        </Navlinks>
      </Navbar>
   
      
    </Container>
  )
}

const Container = styled.div `
  height: 60px;
  display: flex;
  width: 100%;
  align-items: center;
  padding: 0 36px;
  overflow: hidden;
  position: fixed;
  top: 0;
  background: #063537;
  z-index: 1;
`


const Logo = styled.div `
  letter-spacing: 2px;
  width: 210px;
  display: flex;

  h3 {
    padding-top: 3px;
    color: #e6ebeb;
    font-weight: 400;
    padding-left: 6px;
    margin: 0;
  }
`
const Navlinks = styled.div `
  height: 100%;
  margin-right: 0;
  margin-left: auto;
  width: 30%;
  display: flex;
  align-items: center;

`
const StyledLink = styled(Link) `
  margin-right: 10%;
  text-decoration: none;
  letter-spacing: 1.5px;
  color: #BEBEBE;
  padding: 15px 20px;
  white-space: nowrap;
  border-bottom: 3px solid transparent;

  :hover {
    color: white;
    border-bottom: 3px solid #8cecf0;
    transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
  }
`
const Navbar = styled.div  `
  width: 70%;
  margin: 0 auto;
  height: 70px;
  display: flex;
  align-items: center;
`

export default Header
