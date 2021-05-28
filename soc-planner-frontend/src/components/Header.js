import React, { useState } from 'react'
import styled from 'styled-components'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import { Link } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

function Header() {
  
  const [major, setMajor] = useState("computer science")
  const [specialisation, setSpecialisation] = useState("")

  return (
    <Container>
      <Logo>
        <h3 style={{fontWeight: 200}}>SOC</h3> 
        <h3 style={{fontWeight: 600}}>PLANNER</h3>
      </Logo>
      <HeaderBar>
        <Caption>
          <span>FIND A PLAN</span>
        </Caption>
        
        <Major>
          <p>MAJOR:</p>
          <select value={major} onChange={e => setMajor(e.target.value)} className="form-select form-select-sm" name="major" id="major">
            <option value="computer science">Computer Science</option>
            <option value="business analytics">Business Analytics</option>
            <option value="information systems">Information Systems</option>
            <option value="information security">Information Security</option>
          </select>
        </Major>
        <Specialisation>
          <p>SPECIALISATION:</p>
          <input value={specialisation} onChange={e => setSpecialisation(e.target.value)} type="text" id="specialisation" name="specialisation" autocomplete="off" className="form-control form-control-sm" />
        </Specialisation>
        <SubmitField to={`/showplans/${major}/${specialisation}`}>
          <StyledButton type="submit" name="submit">
            <SearchIcon style={{fill: "white", fontSize: 25}} />
          </StyledButton>
        </SubmitField>
      </HeaderBar>
    </Container>
  )
}

const SubmitField = styled(Link) `
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
  width: 100%;
  align-items: center;
  padding: 0 36px;
  overflow: hidden;
  position: fixed;
  top: 0;
  background: #063537;
  z-index: 1;
`

const HeaderBar = styled.form `
  width: 850px;
  display: flex;
  align-items: center;
  margin-left: auto;

  
`
const Caption = styled.div `
  align-items: center;
  margin-right: 5%;
  width: 20%;
  height: 40px;

  span {
    height: 35px;
    display: table-cell;
    letter-spacing: 1.5px;
    font-size: 1em;
    font-weight: 600;
    vertical-align: middle;
    white-space: nowrap;
  }
`

const Logo = styled.div `
  letter-spacing: 2px;
  width: 210px;
  display: flex;
  margin-right: 30px;

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
