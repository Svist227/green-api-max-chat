import './MessagesDate.scss'
type MessagesDateProps = {
    date: string
}
const MessagesDate = ({date}:MessagesDateProps) => {
    return (
        <div className='date'>{date}</div>
    )
}

export default MessagesDate