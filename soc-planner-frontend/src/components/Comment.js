import React from 'react'
import styled from 'styled-components'

function Comment(props) {
    return (
        <Container>
            <Username><b>{props.username}</b></Username>
            <UserComment>{props.comment}</UserComment>
            <hr style={{color: 'gray'}} />
        </Container>
    )
}

const Container = styled.div `
`
const Username = styled.p `
    color: white;
    font-size: 14px;
    margin: 0.5% auto;
`
const UserComment = styled.p `
    color: white;
    font-size: 15px;
`


export default Comment
