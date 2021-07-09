import React from 'react'
import Semester from '../Semester'
import { fireEvent, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

test("shows correct number of modules & MCs", async () => {
    const samplePlan = {
        major: "",
        y1s1: [],
        y1s2: [],
        y2s1: [],
        y2s2: [],
        y3s1: [],
        y3s2: [],
        y4s1: [],
        y4s2: [],
    }

    function sampleFunc(semester, mods, mcs, add) {
    }

    const component = render(<Semester id="y1s1" func={sampleFunc} mods={samplePlan} />)
    const noMods = await component.findByTestId('semester_noMods')
    const noMCs = await component.findByTestId('semester_noMCs')
    expect(noMods.textContent).toEqual('0')
    expect(noMCs.textContent).toEqual('0')
})

test("clicking add module will show dialog", () => {
    const samplePlan = {
        major: "",
        y1s1: [],
        y1s2: [],
        y2s1: [],
        y2s2: [],
        y3s1: [],
        y3s2: [],
        y4s1: [],
        y4s2: [],
    }

    function sampleFunc(semester, mods, mcs, add) {
    }

    const component = render(<Semester id="y1s1" func={sampleFunc} mods={samplePlan} />)
    const addButton = component.getByTestId("semester_addButton")
    expect(component.queryByTestId("semester_searchDialog")).toBeNull()
    
    fireEvent.click(addButton)

    expect(component.getByTestId("semester_searchDialog")).toBeInTheDocument()
})

