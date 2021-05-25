import React from 'react'
import styled from 'styled-components'
import Sidebar from './Sidebar'
import Planner from './Planner'

function Home() {
  return (
    <Container>
      <Sidebar />
      <Planner />
    </Container>
  )
}

const Container = styled.div`
  min-height: calc(100vh - 60px);
  padding: 0 calc(3.5vw + 5px);
  display: flex;
  align-items: center;
`

export default Home
