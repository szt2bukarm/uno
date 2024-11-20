import React from 'react'
import styled from 'styled-components'
import { IoPerson,IoPeople } from "react-icons/io5";
import { IoIosWarning } from "react-icons/io";
import useStore from '../../store.js'

const MenuButtons = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 80px;
`

const MenuButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 18px;
    width: 180px;
    color: #fff;
    background-color: #000;
    border: 2px solid #000;
    padding: 10px 20px;
    border-radius: 15px;
    transition: all 0.075s;

    &:hover {
        cursor: pointer;
        background-color: #fff;
        color: #000;
    }
`

const MenuText = styled.p`
    color: #838383;
    font-size: 14px;
    text-align: center;
    margin-top: 3px;
`

const Warning = styled.div`
    position: absolute;
    display: flex;
    align-items: start;
    gap: 15px;
    background-color: #000;
    color: #fff;
    width: 95%;
    height: 90px;
    border-radius: 15px;
    bottom: 10px;
    padding: 15px;
    font-size: 25px;
`

const WarningIcon = styled(IoIosWarning)`
    font-size: 20px;
    margin-left: 5px;
    min-width: 20px;
`


const WarningText = styled.p`
    font-size: 16px;
`

function Mainpage() {
    const { setCurrentMenuPage } = useStore();

    return (
        <>
        <MenuButtons>
        <div>
        <MenuButton onClick={() => setCurrentMenuPage("local")}>
            <IoPerson />
            Local Match
        </MenuButton>
        <MenuText>2-8 Players (bots)</MenuText>
        </div>
        <div>
        <MenuButton onClick={() => setCurrentMenuPage("online")}>
            <IoPeople />
            Online Match
        </MenuButton>
        <MenuText>2-8 Players (optional bots)</MenuText>
        </div>
    </MenuButtons>

    <Warning>
        <WarningIcon />
        <WarningText>This game is based on common house rules, meaning players can play multiple cards per round, and stack +2 cards.</WarningText>
    </Warning>
    </>
    )
}

export default Mainpage
