import './Message.scss'
import classNames from 'classnames'
interface MessageData {
    text?: string,
    isUser:boolean,
     dataRU:string
}

interface MessageProps {
    data: MessageData
}
const Message = ({data}:MessageProps) => {
    return (
        <>
                <div className={classNames("message",{
            'is-me':data.isUser
        })}>
            <div className="message__text">
                {data.text}
            </div>
            {data.dataRU && (
                <div className="message__info">
                {data.dataRU}
            </div>
            )}
        </div>
        </>
    )
}

export default Message