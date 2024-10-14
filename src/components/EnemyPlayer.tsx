import React from 'react'
import styled from 'styled-components'
import gsap from 'gsap'

const Wrapper = styled.div`
    position: absolute;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 5;
`

const InnerWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    perspective: 1000px;
`

const Cards = styled.div`
    position: absolute;
    width: 500px;
    height: 150px;
    background-color: #fff;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
`


function EnemyPlayer() {

    return (
        <Wrapper>
            <InnerWrapper>
                <Cards />
            </InnerWrapper>
        </Wrapper>
    )
}

export default EnemyPlayer
