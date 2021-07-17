import React from 'react'
import { useState, useEffect } from 'react'
import styled from 'styled-components'
import Comment from './Comment'
import { Dialog, DialogTitle, DialogContent, DialogContentText, makeStyles, TextField, Paper, IconButton, Button } from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send'
import axios from '../dbAxios'
import { validateEmail } from './utils/utils'
import { useSelector, useDispatch } from 'react-redux'
import { setLogin, selectLogin } from '../features/login/loginSlice'

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
    },
    signUpButton: {
      backgroundColor: '#0288d1',
      color: '#ffffff',
      '&:hover': {
        backgroundColor: '#0277bd'
      }

    },
    logInButton: {
      backgroundColor: '#002b36',
      border: '1px solid #6bc6ff',
      color: '#6bc6ff',
      '&:hover': {
        color: '#8cecf0',
        backgroundColor: '#002b36',
        border: '1px solid #8cecf0'
      }
    }
    }))




function CommentsSection(props) {
    const classes = useStyles()
    const dispatch = useDispatch()

    axios.defaults.withCredentials = true

    const [ input, setInput ] = useState('')
    const [ comments, setComments ] = useState([])
    const [ logInOpen, setLogInOpen ] = useState(false)
    const [ signUpOpen, setSignUpOpen ] = useState(false)

    const [ commentPosted, setCommentPosted] = useState(false) // render useEffect when comment posted
    // sign up fields
    const [ signUpEmail, setSignUpEmail ] = useState('')
    const [ signUpUsername, setSignUpUsername ] = useState('')
    const [ signUpPassword, setSignUpPassword ] = useState('')

    const [ signUpEmailError, setSignUpEmailError ] = useState(false)
    const [ signUpUsernameError, setSignUpUsernameError ] = useState(false)
    const [ signUpPasswordError, setSignUpPasswordError ] = useState(false)

    const [ signUpSuccess, setSignUpSuccess ] = useState(false)

    // log in fields
    const [logInEmail, setLogInEmail ] = useState('')
    const [logInPassword, setLogInPassword ] = useState('')

    const [logInEmailError, setLogInEmailError ] = useState(false)
    const [logInPasswordError, setLogInPasswordError ] = useState(false)

    
    useEffect(() => {
      async function getComments() {
          const res = await axios.get('/comment', {
              params: {
                  planid: props.planID
              }
          })
          if (res.data.comments) {
            setComments(res.data.comments)
          }
      } 
      getComments()
      setCommentPosted(false)
    }, [commentPosted])

    useEffect(() => {
        async function checkLoggedIn() {
          const res = await axios.get('/auth/check')
          dispatch(setLogin(res.data))
        }
        checkLoggedIn()
        
    }, [])

    async function postComment(event) {
        event.preventDefault()

        var dateObj = new Date()
        // var day = dateObj.getDate()
        // var month = dateObj.getMonth() + 1
        // var year = dateObj.getFullYear()
        var user = await axios.get('/auth/user', {withCredentials: true})
        const res = await axios.post('/comment/add', {
            plan: props.planID,
            text: input,
            user: user.data.username,
            date: dateObj
        }, {withCredentials: true})


        setInput('')
        setCommentPosted(true)
    }

    async function register(event) {
      event.preventDefault()

      if (signUpUsername === "") {
        setSignUpUsernameError(true)
      }
      if (signUpPassword === "") {
        setSignUpPasswordError(true)
      }
      if (signUpEmail === "" || !validateEmail(signUpEmail)) {
        setSignUpEmailError(true)
      }

      if (signUpUsername !== "" && signUpPassword !== "" && signUpEmail !== "" && validateEmail(signUpEmail)) {
        setSignUpUsernameError(false)
        setSignUpPasswordError(false)
        setSignUpEmailError(false)
        const res = await axios.post('/auth/register', {
            username: signUpUsername,
            password: signUpPassword,
            email: signUpEmail
        }) 
        console.log(res)
        setSignUpEmail('')
        setSignUpPassword('')
        setSignUpUsername('')
        setSignUpSuccess(res.data)
      }
      
    }

    async function logIn(event) {
        event.preventDefault()

        if (logInEmail === "" || !validateEmail(logInEmail)) {
            setLogInEmailError(true)
        }
        if (logInPassword === "") {
            setLogInPasswordError(false)
        }

        if (logInPassword !== "" && logInEmail !== "" && validateEmail(logInEmail)) {
            setLogInEmailError(false)
            setLogInPasswordError(false)
            const res = await axios.post('/auth/login', {
                email: logInEmail,
                password: logInPassword
            })
            if (res.data) {
                console.log(res)
                dispatch(setLogin(true))
            }
            if (res.cookie) {
                console.log(res.cookie)
              } else {
                console.log("RES COOKIE NOT FOUND")
              }
            handleDialogClose()
        }

    }

    function handleDialogClose() {
        setSignUpOpen(false)
        setLogInOpen(false)
        setSignUpEmail('')
        setSignUpEmailError(false)
        setSignUpPassword('')
        setSignUpPasswordError(false)
        setSignUpUsername('')
        setSignUpUsernameError(false)
        setLogInPassword('')
        setLogInPasswordError(false)
        setLogInEmail('')
        setLogInEmailError(false)
        setSignUpSuccess(false)
    }
    

    return (
        <PaperStyled className={classes.creamPaper}>
            <Container>
                <h4 style={{color: '#bebebe'}}>Discussion Thread</h4>
                <Comments>
                    {
                        comments.length > 0 ? 
                            <>
                            { 
                                comments.map(comment => (
                                <Comment username={comment.user} comment={comment.text} date={comment.date} />
                                ))
                            }
                            </> 
                            :
                            <p style={{color: '#bebebe', fontSize: '17px'}}>No comments yet.</p>
                    }
                </Comments>
                
                
                    
                    {
                        useSelector(selectLogin) ? 
                        <CommentForm> 
                            <TextField size="small" placeholder="Type a comment..." variant="outlined" className={classes.formInput} InputProps={{ className: classes.textInput}} value={input} onChange={e => setInput(e.target.value)} /> 
                            <IconButton title="Send Comment" type="submit" onClick={postComment} >
                                <SendIcon className={classes.sendIcon} />
                            </IconButton>
                        </CommentForm>
                        :
                        <LoginPrompt>
                            <span style={{marginRight: '4%'}}>Register or log in to post comments.</span>
                            <Button variant="contained" style={{marginRight: '2%'}} onClick={e => setSignUpOpen(true)} className={classes.signUpButton}>Sign Up</Button>
                            <Button variant="outlined" onClick={e => setLogInOpen(true)} className={classes.logInButton}>Log In</Button>
                        </LoginPrompt>
                    }

              <Dialog open={logInOpen} onClose={e => handleDialogClose()} >
                <DialogTitle><b>Log In</b></DialogTitle>
                <DialogContent>
                  <form>
                    <TextField error={logInEmailError} style={{width: '95%', marginBottom: '20px'}} onChange={e => setLogInEmail(e.target.value)} value={logInEmail} type="email" label="Email address" />
                    <TextField error={logInPasswordError} style={{width: '95%', marginBottom: '20px'}} onChange={e => setLogInPassword(e.target.value)} value={logInPassword} type="password" label="Password" />
                    <Button variant="contained" onClick={e => logIn(e)} className={classes.signUpButton} style={{marginTop: '10px', marginLeft: '77%', marginBottom: '20px'}} type="submit" disableElevation>ENTER</Button>
                  </form>
                </DialogContent>
                                                
              </Dialog>              

              <Dialog open={signUpOpen} onClose={e => handleDialogClose()}>
                {
                    signUpSuccess ?
                    <>
                        <DialogTitle><b>Your account has been successfully created!</b></DialogTitle>
                        <DialogContent>
                            <DialogContentText style={{fontSize: '18px', color: '#4085A7'}}>Log in to access your account.</DialogContentText>
                        </DialogContent>
                        
                    </> :
                    <>
                    <DialogTitle><b>Sign Up For An Account</b></DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField error={signUpEmailError} value={signUpEmail} onChange={e => setSignUpEmail(e.target.value)} style={{width: '95%', marginBottom: '20px'}} type="email" label="Email address" />
                            <TextField error={signUpUsernameError} value={signUpUsername} onChange={e => setSignUpUsername(e.target.value)} style={{width: '95%', marginBottom: '20px'}} type="text" label="Provide a username" />
                            <TextField error={signUpPasswordError} value={signUpPassword} onChange={e => setSignUpPassword(e.target.value)} style={{width: '95%', marginBottom: '20px'}} type="password" label="Provide a password" />
                            <Button variant="contained" className={classes.signUpButton} style={{marginTop: '10px', marginLeft: '77%', marginBottom: '20px'}} type="submit" onClick={e => register(e)} disableElevation>ENTER</Button>
                        </form>
                    </DialogContent>
                    </>
                }
                
              </Dialog>
                
                
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
const LoginPrompt = styled.p `
    color: white;
    font-size: 18px;
    border-width: 1px;
    border-color: rgba(255, 255, 255, 0.4);
    border-style: solid;
    border-radius: 5px;
    padding: 1% 2%;
    margin-top: 5%;
`
export default CommentsSection
