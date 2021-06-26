import React from 'react'
import { render, screen, fireEvent, waitForElement, getByText, waitForElementToBeRemoved } from '@testing-library/react'
import Planner from '../Planner'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import "@testing-library/jest-dom/extend-expect"

// testing initial state

test('planner renders with correct heading', () => {
    const history = createMemoryHistory()
    const component = render(<Router history={history}><Planner/></Router>)
    const plannerHeader = component.getByTestId("planner_header")
    expect(plannerHeader.textContent).toBe("Module Planner")
})

test('major has initial value of computer science', () => {
    const history = createMemoryHistory()
    const component = render(<Router history={history}><Planner/></Router>)
    const initPlannerMajor = component.getByTestId("planner_major")
    expect(initPlannerMajor.value).toBe("computer science")
})

test('specialisation has initial value of artificial intelligence', () => {
    const history = createMemoryHistory()
    const component = render(<Router history={history}><Planner/></Router>)
    const initPlannerSpecialisation = component.getByTestId("planner_specialisation")
    expect(initPlannerSpecialisation.value).toBe("artificial intelligence")
})

// testing user events

test('changing major works correctly', () => {
    const history = createMemoryHistory()
    const { getByTestId } = render(<Router history={history}><Planner/></Router>)
    const major = getByTestId('planner_major')

    fireEvent.change(major, {
        target: {
            value: "information systems"
        }
    })
    expect(major.value).toBe("information systems")

})

test('changing specialisation works correctly', () => {
    const history = createMemoryHistory()
    const { getByTestId } = render(<Router history={history}><Planner/></Router>)
    const specialisation = getByTestId('planner_specialisation')

    fireEvent.change(specialisation, {
        target: {
            value: "parallel computing"
        }
    })
    expect(specialisation.value).toBe("parallel computing")

})

test('submitting plan will show dialog', async () => {
    const history = createMemoryHistory()
    const component = render(<Router history={history}><Planner/></Router>)

    const submitButton = component.getByTestId('planner_submitButton')
    
    fireEvent.click(submitButton)
    screen.debug()

    const dialog = await screen.findByTestId('planner_submitDialog')

    expect(dialog).toBeInTheDocument()
    
    fireEvent.click(submitButton)

    expect(dialog).not.toBeInTheDocument()
})
