import React from 'react'
import { useState, useEffect } from 'react'
import styled from 'styled-components'
import Comment from './Comment'
import { makeStyles, TextField, Paper, IconButton } from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send'
import axios from '../dbAxios'

const useStyles = makeStyles((theme) => ({
    creamPaper: {
        backgroundColor: '#00232b'
    }, 
    formInput: {
        width: '90%',
        marginTop: '1%',
        marginRight: '2%',  
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "white"
        },
        "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "white"
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#8cecf0"
        },
        "& .MuiOutlinedInput-input": {
            color: "white"
        },
        "&:hover .MuiOutlinedInput-input": {
            color: "white"
        },
        "& .MuiInputLabel-outlined": {
            color: "white"
        },
        "&:hover .MuiInputLabel-outlined": {
            color: "white"
        },
        "& .MuiInputLabel-outlined.Mui-focused": {
            color: "#8cecf0"
        }
    },
    textInput: {
        color: 'white',
        fontSize: '14px'
    },
    sendIcon: {
        fontSize: 25,
        fill: 'white',
        '&:hover': {
            fill: '#8cecf0'
        }
    }
}))




function CommentsSection(props) {
    const classes = useStyles()

    const [ input, setInput ] = useState('')
    const [ comments, setComments ] = useState([])

    useEffect(() => {
      async function getComments() {
          const res = await axios.get('/comment', {
              params: {
                  planid: props.planID
              }
          })
          setComments(res.data.comments)
          console.log(res)
      } 
      getComments()
    }, [])

    async function postComment(event) {
        event.preventDefault()
        var dateObj = new Date()
        var day = dateObj.getDate()
        var month = dateObj.getMonth() + 1
        var year = dateObj.getFullYear()
        const res = await axios.post('/comment/add', null, { params: {
            plan: props.planID,
            text: input,
            user: 'john',
            date: day + '/' + month + '/' + year,
            time: dateObj.toLocaleTimeString()
        }})
        console.log(res)

        setInput('')
    
    }

    return (
        <PaperStyled className={classes.creamPaper}>
            <Container>
                <h4 style={{color: '#bebebe'}}>Discussion Thread</h4>
                <Comments>
                    {
                        comments.length > 0 && comments.map(comment => (
                            <Comment username={comment.username} comment={comment.comment} />
                        ))
                    }
                </Comments>
                
                <CommentForm> 
                    <TextField size="small" placeholder="Type a comment..." variant="outlined" className={classes.formInput} InputProps={{ className: classes.textInput}} value={input} onChange={e => setInput(e.target.value)} />
                    <IconButton title="Send Comment" type="submit" onClick={postComment} >
                        <SendIcon className={classes.sendIcon} />
                    </IconButton>
                </CommentForm>
                
            </Container>
        </PaperStyled>
    )
}

const PaperStyled = styled(Paper) `
    width: 100%;
    margin-top: 2%;
`
const Container = styled.div `
    padding: 3% 4%;
`
const Comments = styled.div `
    margin-top: 3%;
`
const CommentForm = styled.form `
    display: flex;
    align-items: center;
`

export default CommentsSection
