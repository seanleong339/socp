import React from 'react'
import styled from 'styled-components'
import { timeSince } from './utils/utils'

function Comment(props) {
    return (
        <Container>
            <Username><b>@{props.username}</b> <TimeAgo>{timeSince(props.date)} ago</TimeAgo></Username>
            <UserComment>{props.comment}</UserComment>
            <hr style={{color: 'gray'}} />
        </Container>
    )
}

const Container = styled.div `
`
const Username = styled.p `
    color: white;
    font-size: 17px;
    margin: 0.5% auto;
`
const UserComment = styled.p `
    color: white;
    font-size: 15px;
`
const TimeAgo = styled.span `
    font-size: 13px;
    color: #bebebe;
`


export default Comment
