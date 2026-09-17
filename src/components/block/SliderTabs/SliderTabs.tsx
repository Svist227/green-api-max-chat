import { chatMode, useFocusStore } from '@/store/chat-ui.store'
import './SliderTabs.scss'

interface SliderTabsProps {
  mode: chatMode
  setMode: (mode: chatMode) => void
}

const modes: chatMode[] = ['chats', 'messages']

const SliderTabs = ({ mode, setMode }: SliderTabsProps) => {
    const triggerFocus  = useFocusStore(state => state.toggle);
  
  const handleSliderClick = (item:chatMode) => {
    setMode(item);
    triggerFocus()
  }

  return (
    <div className="sliderTabs__container">
    <div className="sliderTabs">
      <div
        className="sliderTabs__indicator"
        style={{
          transform: `translateX(${modes.indexOf(mode) * 100}%)`
        }}
      />

      {modes.map((item) => (
        <button 
          key={item}
          className={`sliderTabs__tab ${
            mode === item ? 'active' : ''
          }`}
          onClick={() => handleSliderClick(item)}
        >
          <p style={{textAlign:'center'}}>{item}</p>
        </button>
      ))}
    </div>
    </div>
  )
}

export default SliderTabs