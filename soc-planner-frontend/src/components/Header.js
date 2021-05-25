import React from 'react'
import styled from 'styled-components'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'

function Header() {
  return (
    <Container>
      <Logo>
        <h3 style={{fontWeight: 200}}>SOC</h3> 
        <h3 style={{fontWeight: 600}}>PLANNER</h3>
      </Logo>
      <HeaderBar>
        <Major>
          <p>MAJOR:</p>
          <select className="form-select form-select-sm" name="module" id="module">
            <option value="computer_science">Computer Science</option>
            <option value="business_analytics">Business Analytics</option>
            <option value="info_systems">Information Systems</option>
            <option value="info_security">Information Security</option>
          </select>
        </Major>
        <Specialisation>
          <p>SPECIALISATION:</p>
          <input type="text" id="specialisation" name="specialisation" autocomplete="off" className="form-control form-control-sm" />
        </Specialisation>
        <SubmitField>
          <StyledButton type="submit" name="submit">
            <SearchIcon style={{fill: "white", fontSize: 25}} />
          </StyledButton>
        </SubmitField>
      </HeaderBar>
    </Container>
  )
}

const SubmitField = styled.div `
  width: 10%;
  margin-left: 2%;
  display: flex;
`

const StyledButton = styled(IconButton) `
  &:hover {
    color: white;
  }
`

const Container = styled.div `
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 36px;
  overflow: hidden;
`

const HeaderBar = styled.form `
  width: 700px;
  display: flex;
  align-items: center;
  margin-left: auto;
`
const Logo = styled.div `
  letter-spacing: 2px;
  width: 210px;
  display: flex;
  h3 {
    padding-top: 3px;
    color: #e6ebeb;
    width: 100%;
    font-weight: 400;
  }
`

const Major = styled.div `
  display: flex; 
  margin-right: 5%;
  align-items: center;

  select {
    width: 180px;
    height: 100%;
    background-color: #063537;
    color: white;
    background: #272a3d url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3e%3cpath fill='white' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e") no-repeat right .75rem center/8px 10px
  }
  
  p {
    margin-right: 5%;
    letter-spacing: 1.5px;
    height: 1vh;
    font-size: 0.9em;
  }
`

const Specialisation = styled.div `
  display: flex;
  align-items: center;
  width: 50%;

  input[type=text] {
    background-color: #063537;
    color: white;
    width: 180px;
    height: 100%;
  }

  p {
    margin-right: 1vw;
    letter-spacing: 1.5px;
    height: 1vh;
    font-size: 0.9em;
  }

`

export default Header
