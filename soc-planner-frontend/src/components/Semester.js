import styled from 'styled-components'
import React, { useState } from 'react'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import axios from '../axios'

function Semester() {

    const [modules, setModules] = useState([])
    const [open, setOpen] = useState(false)
    const [input, setInput] = useState('')
    const [credits, setCredits] = useState(0)

    async function addModule(event) {
        const moduleData = await axios.get(`https://api.nusmods.com/v2/2020-2021/modules/${input}.json`)
        setModules([...modules, moduleData])
        setCredits(credits + Number(moduleData.data.moduleCredit))
        setInput('')
        setOpen(false)
    }


    return (
        <Container>

            <Dialog
                open={open}
                onClose={e => setOpen(false)}
                PaperProps={{style: {
                    backgroundColor: '#9dbabb'
                }}}>
                <DialogTitle>Search Module</DialogTitle>
                <DialogContent>
                    <form>
                    <input value={input} onChange={e => setInput(e.target.value)} autoFocus fullWidth type="text" id="module_search" name="module_search" placeholder="Enter module code..." className="form-control form-control-sm" />
                    
                    <DialogActions>
                        <Button disabled={!input} color="primary" onClick={addModule}>Add Module</Button>
                        <Button onClick={e => setOpen(false)}>Cancel</Button>
                    </DialogActions> 
                    
                    </form>
                    
                </DialogContent>
            </Dialog>
            <SemInfo>
                {modules.length}&nbsp;{modules.length === 1 ? <span>module</span> : <span>modules</span>} &nbsp;&nbsp;&nbsp; {credits}MCs    
                &nbsp;&nbsp;&nbsp;&nbsp;
                <AddButton onClick={e => setOpen(true)} data-bs-toggle="collapse" size="small">
                    <AddCircleIcon style={{fill: '#8cecf0', fontSize: 25}} />
                </AddButton>
            </SemInfo>
            
            <Modules>
                <ul>
                    {modules.map(module => (
                        <li>
                            <span><b>{module.data.title}</b> {module.data.moduleCode} {module.data.moduleCredit}MC</span>
                        </li>
                    ))}
                </ul>
            </Modules>
            
        </Container>
    )
}

const Container = styled.div `
    // box-shadow: 0px 0px 0px 3px rgba(0,0,0,0.3);
    height: 100%;
    min-width: 250px;
    border-radius: 15px;
    margin: 0 1%;
    position: relative;
`
const AddButton = styled(IconButton) `
    :hover {
        color: #8cecf0;
        background-color: red;
    }
`
const Modules = styled.div `
    width: 80%;
    span {
        font-size: 13px;
        color: #FAF9F6;
    }
`
const SemInfo = styled.span `
    display: flex;
    align-items: center;
    white-space: nowrap;
    color: #8cecf0;
    font-size: 13px;
    padding-left: 4.3%;
    padding-top: 1%;
`

export default Semester
