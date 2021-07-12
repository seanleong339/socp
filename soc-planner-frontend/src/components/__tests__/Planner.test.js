import React from 'react'
import Planner from '../Planner'
import { fireEvent, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
        pathname: '/',
        search: '',
        hash: '',
        state: undefined,
    })
}))

// initial layout

test("header shows correctly", () => {
    const component = render(<Planner />)
    const header = component.getByTestId('planner_header')
    
    expect(header.textContent).toBe("Module Planner")
})

test("major has initial value of computer science", () => {
    const component = render(<Planner />)
    const majorValue = component.getByTestId('planner_major')
    
    expect(majorValue.value).toBe("computer science")
})

test("specialisation has initial value of aritificial intelligence", () => {
    const component = render(<Planner />)
    const specialisationValue = component.getByTestId('planner_specialisation')
    
    expect(specialisationValue.value).toBe("artificial intelligence")
})

test("Prerequisite section is initially hidden", () => {
    const component = render(<Planner />)
    const prereq = component.queryByTestId('planner_prereqSection')
    
    expect(prereq).toBeNull()
})

// user actions

test("major changes correctly", () => {
    const component = render(<Planner />)
    const majorValue = component.queryByTestId("planner_major")

    fireEvent.change(majorValue, {target: {value: 'information systems'}})

    expect(majorValue.value).toBe('information systems')
})

test("specialisation changes correctly", () => {
    const component = render(<Planner />)
    const specialisationValue = component.queryByTestId("planner_specialisation")

    fireEvent.change(specialisationValue, {target: {value: 'programming languages'}})

    expect(specialisationValue.value).toBe('programming languages')
})

test("dialog shows after clicking submit button", () => {
    const component = render(<Planner />)
    const submitButton = component.getByTestId("planner_submitButton")

    expect(component.queryByTestId("planner_submitDialog")).toBeNull()
    fireEvent.click(submitButton)
    expect(component.getByTestId("planner_submitDialog")).toBeInTheDocument()
})

test("prerequisite section shows correctly on click", async () => {
    const component = render(<Planner />)
    const prereqButton = component.getByTestId("planner_prereqButton")
    expect(component.queryByTestId("planner_prereqSection")).toBeNull()

    fireEvent.click(prereqButton)
    const prereqSectionAppears = await component.findByTestId("planner_prereqSection")
    expect(prereqSectionAppears).toBeInTheDocument()
    
})

test("prerequisite section shows correct major and specialisation", async () => {
    const component = render(<Planner />)
    const prereqButton = component.getByTestId("planner_prereqButton")
    const specialisationValue = component.queryByTestId("planner_specialisation")
    const majorValue = component.queryByTestId("planner_major")


    fireEvent.change(majorValue, {target: {value: 'business analytics'}})
    fireEvent.change(specialisationValue, {target: {value: 'financial analytics'}})

    fireEvent.click(prereqButton)
    const prereqSectionAppears = await component.findByTestId("planner_prereqSection")
    expect(prereqSectionAppears).toBeInTheDocument()

    expect(component.getByTestId("planner_prereqMajor").textContent).toBe("Business Analytics")
    expect(component.getByTestId("planner_prereqSpecialisation").textContent).toBe(", Financial Analytics")
})