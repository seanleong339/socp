import React from 'react'
import styled from 'styled-components'

function Sidebar() {
  return (
    <Container>
      <ul>
        <li>Planner</li>
        <li>Submit Plan</li>
      </ul>
    </Container>
  )
}

const Container = styled.div `
  width: 170px;

  li {
    margin: 30px 0px;
    padding: 7px 15px;
    text-align: center;
    border: 1px solid white;
    border-radius: 15px;
    font-size: 15px;
    white-space: nowrap;
  }

  li:hover {
    border: 1px solid #8cecf0;
    color: #8cecf0;
    cursor: pointer;
    transition: all 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
  }
`

export default Sidebar
