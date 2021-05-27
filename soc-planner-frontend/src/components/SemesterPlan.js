import styled from 'styled-components'
import React, { useState, useEffect } from 'react'
import axios from '../nusmodsAxios'

function SemesterPlan(props) {

    const [modules, setModules] = useState([])

    useEffect(() => {
        async function fillData(moduleCodes) {
            var fillModules = []
            for (let i = 0; i < moduleCodes.length; i++) {
                const codeUpperCase = moduleCodes[i].toUpperCase()
                const data = axios.get(`https://api.nusmods.com/v2/2020-2021/modules/${codeUpperCase}.json`)
                fillModules.push(data.catch(err => moduleCodes[i]))
            }
            Promise.all(fillModules).then(values => (
                setModules([...modules, ...values.filter(x => modules.indexOf(x) < 4)])
            ))
            
        }

        if (props.modules) {
            fillData(props.modules)
        }
    }, [])



    return (
        <Container>
            <Modules>
                <ul>
                    {modules.map(module => ( module.data ? 
                        <li>
                            <span><b>{module.data.title}</b> {module.data.moduleCode} {module.data.moduleCredit}MC</span>
                        </li> : 
                        <li>
                            <span><b>{module.toUpperCase()}</b></span>
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

const Modules = styled.div `
    width: 80%;
    display: flex;
    align-items: center;
    ul {
        margin-top: 2%;
    }
    span {
        font-size: 13px;
        color: #FAF9F6;
    }


`


export default SemesterPlan
