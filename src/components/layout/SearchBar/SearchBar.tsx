import { useEffect, useState } from 'react'
import './SearchBar.scss'
import { useRef } from 'react';
import { useChatMode, useFocusStore } from '@/store/chat-ui.store';
import { useValueSearch } from '@/store/chat-selection.store';

const SearchBar = () => {
    const setMode = useChatMode(state => state.setMode)
    const mode = useChatMode(state => state.mode)
    console.log('мод:', mode)
    const value = useValueSearch(state => state.currentValue)
    const setValue = useValueSearch(state => state.setValue)
    const inputRef = useRef<HTMLInputElement>(null);
    const {isOpen, toggle} = useFocusStore()
    const handleChangeInput = (e:React.FormEvent<HTMLInputElement>) => {
    const event = e.currentTarget
    setValue(event.value)
    }
    useEffect(() => {
   
    if(mode!= 'messages' && mode != 'default') return setMode('chats') // не работает что-то
    // если крик произошел на элементе searchbar__input-inner то chats иначе ь    
}, [value, mode])

    useEffect(() => {
        if (isOpen){
            inputRef.current?.focus()
             toggle()
        }
    }, [isOpen])
    
    const handleCLickCross = () => {
        setValue('')
        setMode('default')
    }

    const handleBack = (e:React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !value) {
            setMode('default')
            e.currentTarget.blur()

  }

    }

    const handleClickValue = () => {
        setMode('chats')
    }   


    return (
        <>
        <div className="searchbar">
             <div className="searchbar__burger">
                  
            </div>
            <div className="searchbar__input" >
            
            <input className='searchbar__input-inner' 
            type="text" placeholder='Search' onChange={handleChangeInput} 
            value={value} onClick={handleClickValue} onKeyDown={handleBack} 
            ref={inputRef}
            />

            {mode != 'default' && (
                <img src="cross.svg" alt="nn" className='searchbar__input-img' onClick={handleCLickCross}/>

            )}
            </div>
            
        </div>
        </>
    )
}

export default SearchBar