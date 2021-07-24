import React from 'react'
import styled from 'styled-components'
import CloseIcon from '@material-ui/icons/Close'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Alert from '@material-ui/lab/Alert'
import { makeStyles, Input, InputLabel, Button, Collapse, Dialog, DialogTitle, DialogContent, DialogContentText, IconButton, TextField, Menu, MenuItem } from '@material-ui/core'
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
  },
  setUserButton: {
    backgroundColor: '#102e4a',
    color: '#fffff0',
    border: '#fffff0 1px solid',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#102e4a',
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
  const [ changeUsernameOpen, setChangeUsernameOpen ] = useState(false)
  const [ changePasswordOpen, setChangePasswordOpen ] = useState(false)

  const [ username, setUsername ] = useState('')
  const [ updateUsername, setUpdateUsername ] = useState(username) 
  const [ updateUsernameError, setUpdateUsernameError ] = useState(false)

  const [ password, setPassword ] = useState('')
  const [ updatePassword, setUpdatePassword ] = useState('')
  const [ currentPasswordError, setCurrentPasswordError ] = useState(false)
  const [ updatePasswordError, setUpdatePasswordError ] = useState(false)

  // alert state for authentication
  const [ alertOpen, setAlertOpen ] = useState(false)
  const [ alertMessage, setAlertMessage ] = useState('')

  // menu open/close state
  const [ anchorEl, setAnchorEl ] = useState(null)


  // sign up fields
  const [ signUpEmail, setSignUpEmail ] = useState('')
  const [ signUpUsername, setSignUpUsername ] = useState('')
  const [ signUpPassword, setSignUpPassword ] = useState('')

  const [ signUpEmailError, setSignUpEmailError ] = useState(false)
  const [ signUpEmailErrorMessage, setSignUpEmailErrorMessage ] = useState('')
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
      const emailRes = await axios.get('/auth/user', {headers: {Authorization: localStorage.getItem("token")}})
      const email = emailRes.data.email
      const usernameRes = await axios.post('/auth/getname', {email: email}, {headers: {Authorization: localStorage.getItem("token")}} )
      setUsername(usernameRes.data)
      setUpdateUsername(usernameRes.data)
    }
    
    if (localStorage.getItem("token") !== null) { // if user logged in
      setUser()
    }
    
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
      setSignUpEmailErrorMessage("Invalid email")
    }

    if (signUpUsername !== "" && signUpPassword !== "" && signUpEmail !== "" && validateEmail(signUpEmail)) {
      setSignUpUsernameError(false)
      setSignUpPasswordError(false)
      setSignUpEmailError(false)
      const res = await axios.post('/auth/register', {
          username: signUpUsername,
          password: signUpPassword,
          email: signUpEmail
      }, {headers: {Authorization: localStorage.getItem("token")}}) 
      console.log(res)

      if (res.data === "email already in use") {
        setSignUpEmailError(true)
        setSignUpEmailErrorMessage("Email already in use")
      } else {
        setSignUpEmail('')
        setSignUpPassword('')
        setSignUpUsername('')
        setSignUpSuccess(res.data)
      }
      
    }
    
  }

  async function logIn(event) {
    event.preventDefault()

    if (logInEmail === "" || !validateEmail(logInEmail)) {
        setLogInEmailError(true)
    }
    if (logInPassword === "") {
        setLogInPasswordError(true)
    }

    if (logInPassword !== "" && logInEmail !== "" && validateEmail(logInEmail)) {
        setLogInEmailError(false)
        setLogInPasswordError(false)
        const res = await axios.post('/auth/login', {
            email: logInEmail,
            password: logInPassword
        }).catch(e => e)
        console.log(res)
        if (res.data.success) {
          localStorage.setItem("token", res.data.token)
          dispatch(setLogin(true))
          handleDialogClose()
        } else {
          setLogInPasswordError(true)
          setLogInEmailError(true)
        }
        
        
    }

  }

  async function logOut(event) {
    event.preventDefault()
    setAnchorEl(null)

    localStorage.removeItem("token")
    dispatch(setLogin(false))
  }

  async function changeUsername(event) {
    event.preventDefault()
    if (updateUsername == "") {
      setUpdateUsernameError(true)
    } else {
      const res = await axios.post("/auth/changename", {
        change: updateUsername 
      }, {headers: {Authorization: localStorage.getItem("token")}})
      
      setChangeUsernameOpen(false)
      setAnchorEl(null)
      setUpdateUsernameError(false)
      if (res.data) {
        setAlertMessage("Username changed successfully")
        setAlertOpen(true)
        setUsername(updateUsername)
      }
      console.log(res)
    }
    
  }

  async function changePassword(event) {
    event.preventDefault()

    if (updatePassword === "") {
      setUpdatePasswordError(true)
    } else {
      const res = await axios.post("/auth/changepassword", {
        password: password,
        change: updatePassword
      }, {headers: {Authorization: localStorage.getItem("token")}})
      setAnchorEl(null)
      if (res.data.pass) {
        setAlertMessage("Password changed successfully")
        setChangePasswordOpen(false)
        setAlertOpen(true)
      } else {
        setCurrentPasswordError(true)
      }
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

  function handleUpdatePasswordClose(event) {
    setChangePasswordOpen(false)
    setUpdatePassword("")
    setPassword("")
    setCurrentPasswordError(false)
    setUpdatePasswordError(false)
  }

  function handleUpdatePasswordOpen(event) {
    setChangePasswordOpen(true)
    setCurrentPasswordError(false)
    setUpdatePasswordError(false)
    setPassword("")
    setUpdatePassword("")
  }

  function handleUpdateUsernameClose(event) {
    setChangeUsernameOpen(false)
    setUpdateUsername(username)
    setUpdateUsernameError(false)
  }


  return (
    <Container>

          <Collapse in={alertOpen} style={{position: 'absolute', marginLeft: "30%", width: "40%"}} >
            <Alert
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setAlertOpen(false);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              }
            >
              {alertMessage}
            </Alert>
          </Collapse>

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
                    <TextField error={logInPasswordError} style={{width: '95%', marginBottom: '20px'}} onChange={e => setLogInPassword(e.target.value)} value={logInPassword} helperText={logInEmailError && logInPasswordError ? "Either username or password is incorrect." : "" } type="password" label="Password" />
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
                            <TextField error={signUpEmailError} value={signUpEmail} onChange={e => setSignUpEmail(e.target.value)} style={{width: '95%', marginBottom: '20px'}} helperText={signUpEmailErrorMessage} type="email" label="Email address" helper="" />
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
                <Button variant="contained" onClick={e => setAnchorEl(e.currentTarget)} className={classes.setUserButton}>@{username}</Button>
                <Menu
                  id="user menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}>
                  <MenuItem onClick={() => setChangeUsernameOpen(true)}>Change username</MenuItem>
                  <MenuItem onClick={handleUpdatePasswordOpen}>Change password</MenuItem><hr/>
                  <MenuItem onClick={e => logOut(e)}>Log Out</MenuItem>
                </Menu>
              </>
              :
              <>
                <Button variant="contained" style={{marginRight: '2%'}} onClick={e => setSignUpOpen(true)} className={classes.signUpButton}>Sign Up</Button>
                <Button variant="outlined" onClick={e => setLogInOpen(true)} className={classes.logInButton}>Log In</Button>
              </>
            }
            
          </AccountButtons>

          <Dialog open={changeUsernameOpen} onClose={handleUpdateUsernameClose}>
            <DialogTitle>Change Username</DialogTitle>
            <DialogContent>
              <form>
                <InputLabel style={{marginBottom: "10px"}}>New username: </InputLabel>
                <TextField style={{width: "95%", marginBottom: "40px"}} error={updateUsernameError} label={updateUsernameError ? "Username cannot be empty" : "" } onChange={e => setUpdateUsername(e.target.value)} value={updateUsername} type="text" />
                <Button variant="contained" color="primary" type="submit" onClick={e => changeUsername(e)}>Save</Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={changePasswordOpen} onClose={handleUpdatePasswordClose}>
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent>
              <form>
                <InputLabel style={{marginBottom: "10px"}}>Current password: </InputLabel>
                <TextField style={{width: "95%", marginBottom: "40px"}} type="password" onChange={e => setPassword(e.target.value)} value={password} label={currentPasswordError ? "Wrong current password" : ""} error={currentPasswordError}  />
                <InputLabel>New password: </InputLabel>
                <TextField style={{width: "95%", marginBottom: "40px"}} type="password" onChange={e => setUpdatePassword(e.target.value)} value={updatePassword} label={updatePasswordError ? "Password cannot be empty" : ""} error={updatePasswordError} />
                <Button variant="contained" color="primary" type="submit" onClick={e => changePassword(e)}>Save</Button>
              </form>
            </DialogContent>
          </Dialog>

          

          {/* <Dialog open={userOpen} onClose={e => setUserOpen(false)}>
            <DialogTitle>Account Settings</DialogTitle>
            <DialogContent>
              <form>
                <InputLabel>Update Username</InputLabel>
                <Input type="text" style={{width: "95%", marginBottom: "20px"}} label="Set username" />
                <InputLabel htmlFor="standard-adornment-password">Update Password</InputLabel>
                <Input 
                  id="standard-adornment-password"
                  type={passwordVisibility ? "text" : "password"} 
                  style={{width: "95%", marginBottom: "40px"}} 
                  label="Set password"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => passwordVisibility ? setPasswordVisibility(false) : setPasswordVisibility(true)}
                      >
                        { passwordVisibility ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }/>
                <Button variant="outlined">Save</Button>
              </form>
            </DialogContent>
          </Dialog> */}
            
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
