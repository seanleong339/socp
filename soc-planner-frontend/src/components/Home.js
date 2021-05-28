import React from 'react'
import styled from 'styled-components'
import Planner from './Planner'
import ShowPlans from './ShowPlans'
import SubmitPlan from './SubmitPlan'
import {
  Switch,
  Route,
  Link
} from 'react-router-dom'


function Home() {
  return (
    <Container>
      <Sidebar>
      <ul>
        <li>
          <StyledLink to="/">Planner</StyledLink>
        </li>
        <li>
          <StyledLink to="/showplans">Show Plans</StyledLink>
        </li>
        <li>
          <StyledLink to="/submitplan">Submit Plan</StyledLink>
        </li>
      </ul>
      </Sidebar>
      <Switch>
        <Route exact path="/">
          <Planner />
        </Route>
        <Route path="/showplans/:major?/:specialisation?">
          <ShowPlans />
        </Route>
        <Route path="/submitplan">
          <SubmitPlan />
        </Route>
      </Switch>
    </Container>
  )
}

const Container = styled.div`
  margin-top: 70px;
  min-height: calc(100vh - 60px);
  padding: 0 calc(3.5vw + 5px);
  display: flex;
  align-items: center;
`
const Sidebar = styled.div `
  width: 170px;
  position: fixed;
  top: 40%;
  left: 2%;
  right: 5%;
  overflow-x: hidden;

  li {
    margin: 40px 0px;
  }
`

const StyledLink = styled(Link) `
  text-decoration: none;
  padding: 7px 15px;
  width: 100px;
  text-align: center;
  border: 1px solid white;
  border-radius: 15px;
  font-size: 15px;
  white-space: nowrap;
  color: white;

  :hover {
    border: 1px solid #8cecf0;
    color: #8cecf0;
    cursor: pointer;
    transition: all 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
  }
`

export default Home
