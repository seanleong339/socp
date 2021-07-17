import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { makeStyles, Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField } from '@material-ui/core'
import axios from '../dbAxios'
import { validateEmail } from './utils/utils'
import { useDispatch, useSelector } from 'react-redux'
import { setLogin, selectLogin } from '../features/login/loginSlice'


const useStyles = makeStyles((theme) => ({
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
  })
)

function Header() {

  const classes = useStyles()
  const dispatch = useDispatch()

  axios.defaults.withCredentials = true


  const [ signUpOpen, setSignUpOpen ] = useState(false)
  const [ logInOpen, setLogInOpen ] = useState(false)

  const [ username, setUsername ] = useState('')

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
    async function setLoginStatus() {
      const res = await axios.get('/auth/check', {withCredentials: true})
      dispatch(setLogin(res.data))
    }
    
    setLoginStatus()
  }, [])

  useEffect(() => {
    async function setUser() {
      const res = await axios.get('/auth/user')
      setUsername(res.data.username)
    }
    setUser()
  }, [useSelector(selectLogin)])

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
        }, {withCredentials: true})
        if (res.data) {
            dispatch(setLogin(true))
        }
        
        handleDialogClose()
    }

  }

  async function logOut(event) {
    event.preventDefault()

    const res = axios.post('/auth/logout', {withCredentials: true})
    dispatch(setLogin(false))
    console.log(res)
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
    <Container>
      <Navbar>
        <Link style={{textDecoration: 'none'}} to="/">
          <Logo>
            <h3 style={{fontWeight: 200}}>SOC</h3> 
            <h3 style={{fontWeight: 600}}>PLANNER</h3>
          </Logo>
        </Link>

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
        
        <Navlinks>
          <NavButtons>
            <StyledLink to="/">PLANNER</StyledLink>
            <StyledLink to="/showplans">SHOW PLANS</StyledLink>
          </NavButtons>
            
          <AccountButtons>
            {
              useSelector(selectLogin) ? 
              <>
                <span style={{fontSize: '18px', fontWeight: '100'}}>Hello, @{username}</span>
                <Button variant="contained" onClick={e => logOut(e)} className={classes.logInButton}>Log Out</Button>
              </>
              :
              <>
                <Button variant="contained" style={{marginRight: '2%'}} onClick={e => setSignUpOpen(true)} className={classes.signUpButton}>Sign Up</Button>
                <Button variant="outlined" onClick={e => setLogInOpen(true)} className={classes.logInButton}>Log In</Button>
              </>
            }
            
          </AccountButtons>
            
        </Navlinks>
      </Navbar>

      
   
      
    </Container>
  )
}

const Container = styled.div `
  height: 60px;
  display: flex;
  width: 100%;
  align-items: center;
  padding: 0 36px;
  overflow: hidden;
  position: fixed;
  top: 0;
  background: #102e4a;
  z-index: 1;
  box-shadow: rgb(0 0 0 / 26% ) 0px 26px 30px -10px;

`

const Logo = styled.div `
  letter-spacing: 2px;
  width: 210px;
  display: flex;

  h3 {
    padding-top: 3px;
    color: #e6ebeb;
    font-weight: 400;
    padding-left: 6px;
    margin: 0;
  }
`
const Navlinks = styled.div `
  height: 100%;
  margin-right: 0;
  margin-left: auto;
  width: 55%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`
const AccountButtons = styled.div  `
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  height: 100%;
  width: 35%;
`
const NavButtons = styled.div `
  width: 50%;
  display: flex;
  justify-content: space-evenly;
`
const StyledLink = styled(Link) `
  margin-right: 5%;
  text-decoration: none;
  letter-spacing: 1.5px;
  color: #BEBEBE;
  padding: 15px 20px;
  white-space: nowrap;
  border-bottom: 3px solid transparent;
  font-size: 17px;
  font-weight: 400;

  :hover {
    color: white;
    border-bottom: 3px solid #8cecf0;
    transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
  }
`
const Navbar = styled.div  `
  width: 90%;
  margin: 0 auto;
  height: 70px;
  display: flex;
  align-items: center;
`

export default Header
