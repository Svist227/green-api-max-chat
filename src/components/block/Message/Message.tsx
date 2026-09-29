import './Message.scss'
import classNames from 'classnames'
import { useState } from 'react'
interface MessageData {
    text?: string,
    imageUrl?: string,
    isUser:boolean,
     dataRU:string
}

interface MessageProps {
    data: MessageData
}
const Message = ({data}:MessageProps) => {
    const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null)
    const imageUrl = data.imageUrl && /^https?:\/\//i.test(data.imageUrl) ? data.imageUrl : null
    return (
        <>
                <div className={classNames("message",{
            'is-me':data.isUser
        })}>
            {data.imageUrl !== undefined && (
                imageUrl && failedImageUrl !== imageUrl ? (
                    <a className="message__image-link" href={imageUrl} target="_blank" rel="noopener noreferrer">
                        <img
                            className="message__image"
                            src={imageUrl}
                            alt="Изображение в сообщении"
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                            onError={() => setFailedImageUrl(imageUrl)}
                        />
                    </a>
                ) : <span>Изображение недоступно</span>
            )}
            {data.text && <div className="message__text">
                {data.text}
            </div>}
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
