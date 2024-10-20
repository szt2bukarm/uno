import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import gsap from 'gsap'
import EnemyPlayer from './EnemyPlayer'
import useStore from '../store.js'

const Wrapper = styled.div`
    position: absolute;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 1;
`

const InnerWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    perspective: 1000px;
`

const Players = styled.div`
    position: absolute;
    top: 0;
    left: 50%;
    /* transform: translateX(-1500px); */
    display: flex;
    transition: transform .3s;

`



function EnemyPlayerWrapper() {
    const { currentPlayer } = useStore();
    const [transform,setTransform] = useState(500);

    const getTransform = () => {
        if (currentPlayer == 0) setTransform(500)
        setTransform(500+(currentPlayer-1)*1000);
    }

    useEffect(() => {
        setTimeout(() => {
        getTransform();
            
        }, 700);
    },[currentPlayer])

    return (
        <Wrapper>
            <InnerWrapper>
                <Players style={{transform: `translateX(-${transform}px)`}}>
                <EnemyPlayer playerNo={1}/>
                <EnemyPlayer playerNo={2}/>
                <EnemyPlayer playerNo={3}/>
                <EnemyPlayer playerNo={4}/>
                <EnemyPlayer playerNo={5}/>
                <EnemyPlayer playerNo={6}/>
                <EnemyPlayer playerNo={7}/>
                {/* <EnemyPlayer playerNo={2}/> */}
                </Players>
            </InnerWrapper>
        </Wrapper>
    )
}

export default EnemyPlayerWrapper
