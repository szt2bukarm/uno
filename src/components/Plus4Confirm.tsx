import React from 'react'
import styled from 'styled-components'
import useStore from '../store.js'

const Wrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #00000090;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: all;
    z-index: 9;
`

const InnerWrapper = styled.div`
    display: flex;
    gap: 10px;
    transform: translateY(200px);
`
const Button = styled.button`
    padding: 10px 20px;
    border-radius: 30px;
    border: none;
    font-size: 20px;
    background-color: #ffffff;
    transition: 0.2s;

    &:hover {
        cursor: pointer;
        background-color: #000;
        color: #ffffff;
    }
`


interface Props {
    onClick: () => void
}

function Plus4Confirm({onClick}: Props) {
    const { setShowPlus4Confirm,setShowColorChanger } = useStore();

    const openColorChanger = () => {
        setShowColorChanger(true);
        setShowPlus4Confirm(false);
    }

    return (
        <Wrapper>
            <InnerWrapper>
                <Button onClick={onClick}>Place another +4 card</Button>
                <Button onClick={openColorChanger}>Change color</Button>
            </InnerWrapper>
        </Wrapper>
    )
}

export default Plus4Confirm
