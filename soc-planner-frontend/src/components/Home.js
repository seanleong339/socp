import React from 'react'
import styled from 'styled-components'
import ShowPlans from './ShowPlans'
import Planner from './Planner'
import { Switch, Route } from 'react-router-dom'


function Home() {
  return (
    <Container>
      
      <Switch>
        <Route exact path="/">
          <Planner />
        </Route>
        <Route path="/showplans">
          <ShowPlans />
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
export default Home
