import React from 'react'
import ShowPlans from '../ShowPlans'
import { Provider } from 'react-redux'
import { store } from '../../app/store'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import '@testing-library/jest-dom'

test("header shows correctly", () => {
    const component = render(<Provider store={store}><ShowPlans /></Provider>)
    const header = component.getByTestId("showplans_header")
    expect(header.textContent).toBe("Study Plans")
})

test("there is no filter for the major", () => {
    const component = render(<Provider store={store}><ShowPlans /></Provider>)
    const major = component.getByTestId("showplans_major")
    expect(major.value).toBe('')
})

test("there is no filter for the specialisation", () => {
    const component = render(<Provider store={store}><ShowPlans /></Provider>)
    const specialisation = component.getByTestId("showplans_specialisation")
    expect(specialisation.value).toBe('')
})

// user actions

test("changing major filter works correctly", () => {
    const component = render(<Provider store={store}><ShowPlans /></Provider>)
    const major = component.getByTestId("showplans_major")
    fireEvent.change(major, {target: {value: "information security"}})

    expect(major.value).toBe('information security')
})

test("changing specialisation filter works correctly", () => {
    const component = render(<Provider store={store}><ShowPlans /></Provider>)
    const specialisation = component.getByTestId("showplans_specialisation")
    const major = component.getByTestId("showplans_major")

    fireEvent.change(major, {target: {value: 'computer science'}})
    fireEvent.change(specialisation, {target: {value: "computer security"}})

    expect(specialisation.value).toBe('computer security')
})

test("upvoting plan works properly", () => {
    const component = render(<Provider store={store}><BrowserRouter><ShowPlans /></BrowserRouter></Provider>)
    waitFor(() => {
        const upvotes = component.getAllByTestId("showplans_thumbsUpIcon")
        const firstUpvote = upvotes[0]
        const upvoteButtons = component.getAllByTestId("showplans_thumbsUpButton")
        const firstUpvoteButton = upvoteButtons[0]

        expect(firstUpvote).toHaveStyle(`fill: white`)
        fireEvent.click(firstUpvoteButton)
        expect(firstUpvote).toHaveStyle(`fill: #0288d1`)
    })
}   )

test("downvoting plan works properly", () => {
    const component = render(<Provider store={store}><BrowserRouter><ShowPlans /></BrowserRouter></Provider>)
    waitFor(() => {
        const downvotes = component.findAllByTestId("showplans_thumbsDownIcon")
        const firstDownvote = downvotes[0]
        const downvoteButtons = component.findAllByTestId("showplans_thumbsDownButton")
        const firstDownvoteButton = downvoteButtons[0]

        expect(firstDownvote).toHaveStyle(`fill: white`)
        fireEvent.click(firstDownvoteButton)
        expect(firstDownvote).toHaveStyle(`fill: #0288d1`)
    })
})


test("upvoting then downvoting works properly", () => {
    const component = render(<Provider store={store}><BrowserRouter><ShowPlans /></BrowserRouter></Provider>)

    waitFor(() => {
        const downvotes = component.findAllByTestId("showplans_thumbsDownIcon")
        const firstDownvote = downvotes[0]
        const upvotes = component.findAllByTestId("showplans_thumbsUpIcon")
        const firstUpvote = upvotes[0]

        const upvoteButtons = component.findAllByTestId("showplans_thumbsUpButton")
        const downvoteButtons = component.findAllByTestId("showplans_thumbsDownButton")

        const firstDownvoteButton = downvoteButtons[0]
        const firstUpvoteButton = upvoteButtons[0]

        fireEvent.click(firstUpvoteButton)

        expect(firstUpvote).toHaveStyle(`fill: #0288d1`)
        fireEvent.click(firstDownvoteButton)
        expect(firstUpvote).toHaveStyle(`fill: white`)
        expect(firstDownvote).toHaveStyle(`fill: #0288d1`)
        

    })

})