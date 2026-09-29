import Link from 'next/link'
import './Form.scss'
import CircularProgress from '@mui/material/CircularProgress'
import Backdrop from '@mui/material/Backdrop'


const data = {
  register: {
    label: 'QR',
    question: 'Есть аккаунт?',
    link: 'Авторизация',
    labelButton: 'Получить QR',
    href: '/login'
  },
   signin: {
    label: 'Вход',
    question: 'Не зарегестрированы в Green API?',
    link: 'Создать аккаунт',
    labelButton: 'Войти',

    href: '/register'
}
}

interface dataMode {
  mode: 'register' | 'signin',
  errorLog?: string
  onSubmit?: React.FormEventHandler<HTMLFormElement>
  loading: boolean
  qr?: string | undefined 
}


const 
Form = ({ mode, errorLog, onSubmit, loading, qr }:dataMode) => {
  const { label, question, link, labelButton ,href } = data[mode];

 
  
  return (
     <main className= 'main' >
    
	<div className="container">
		<section className="wrapper">
      {loading && (    <CircularProgress  className = 'wrapper-loader' aria-label="Loading…" />
)}
			<div className="heading">
				<h1 className="text text-large">{label}</h1>
				<p className="text text-normal">{question} <span><Link href={href} className="text text-links">{link}</Link></span>
				</p>
			</div>
			<form name="signin" className="form" onSubmit={onSubmit} >
		
         {mode === 'signin' && (
          <>
          <div className="input-control">
					<label htmlFor="idInstance" className="input-label" hidden>idInstance</label> 
          <input type="text" name="idInstance" id="idInstance" className="input-field" placeholder="idInstance" required/>
				</div>
          <div className="input-control">
					<label htmlFor="apiTokenInstance" className="input-label" hidden>apiTokenInstance</label>
            <input type="password" name="apiTokenInstance" id="apiTokenInstance" className="input-field" placeholder="apiTokenInstance" required/>
				</div>
        </>
         )}
         {mode === 'register' && (
          <>
         {qr && (
  <img height={'100px'} width={'100px'}
    src={`data:image/png;base64,${qr}`}
    alt="QR code"
  />
)}  
          </>
         )}
				<div className='error-log'>
					<p> {errorLog }</p>
				</div>
				<div className="input-control">
					{/* <a href="#" className="text text-links">Forgot Password</a> */}
					<div className='center'>
            <button type="submit" name="submit" className="input-submit" >

            {labelButton}
          </button>
          </div>
          <Backdrop
  sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
  open={loading}
>
</Backdrop>
				</div>
			</form>
		   
		</section>
	</div>
</main>
    )
}

export default Form
