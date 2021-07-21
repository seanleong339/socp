import React from 'react'
import CommentsSection from '../CommentsSection'
import { store } from '../../app/store'
import { fireEvent, render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Provider } from 'react-redux'

test("header shows correctly", () => {
    const component = render(<Provider store={store}><CommentsSection /></Provider>)
    const header = component.getByTestId("commentsSection_header")
    expect(header).toBeInTheDocument()
})

test("displays no comments when there are no comments", () => {
    const component = render(<Provider store={store}><CommentsSection /></Provider>)
    const noComments = component.getByTestId("commentsSection_noComments")
    expect(noComments).toBeInTheDocument()
})