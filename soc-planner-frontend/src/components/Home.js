import React from 'react'
import styled from 'styled-components'
import ShowPlans from './ShowPlans'
import Planner from './Planner'
import CommentsPage from './CommentsPage'
import { Switch, Route } from 'react-router-dom'


function Home() {
  return (
    <Container data-testid="home">
      
      <Switch>
        <Route exact path="/">
          <Planner />
        </Route>
        <Route path="/showplans">
          <ShowPlans />
        </Route>
        <Route path="/comments">
          <CommentsPage />
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
