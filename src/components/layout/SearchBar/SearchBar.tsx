import { useEffect } from 'react'
import './SearchBar.scss'
import { useRef } from 'react';
import { useChatMode, useFocusStore } from '@/store/chat-ui.store';
import { usesChatStore, useValueSearch } from '@/store/chat-selection.store';

const SearchBar = () => {
    const setMode = useChatMode(state => state.setMode)
    const mode = useChatMode(state => state.mode)
    const value = useValueSearch(state => state.currentValue)
    const isMax = usesChatStore(state => state.accountKey?.startsWith('max:'))
    const setValue = useValueSearch(state => state.setValue)
    const inputRef = useRef<HTMLInputElement>(null);
    const {isOpen, toggle} = useFocusStore()
    const handleChangeInput = (e:React.FormEvent<HTMLInputElement>) => {
    const event = e.currentTarget
    setValue(event.value)
    if (mode === 'default') setMode('chats')
    }

    useEffect(() => {
        if (isOpen){
            inputRef.current?.focus()
             toggle()
        }
    }, [isOpen, toggle])
    
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
        if (mode === 'default') setMode('chats')
    }   


    return (
        <>
        <div className="searchbar">
             <div className="searchbar__burger">
                  
            </div>
            <div className="searchbar__input" >
            
            <input className='searchbar__input-inner' 
            type="text" placeholder={mode === 'messages' ? 'Поиск в текущем чате' : isMax ? 'Имя или телефон' : 'Имя, @username или телефон'} onChange={handleChangeInput}
            value={value} onClick={handleClickValue} onKeyDown={handleBack} 
            ref={inputRef}
            />

            {mode != 'default' && (
                <img src="cross.svg" alt="Очистить поиск" className='searchbar__input-img' onClick={handleCLickCross}/>

            )}
            </div>
            
        </div>
        </>
    )
}

export default SearchBar
