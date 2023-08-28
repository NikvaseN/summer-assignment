import React from 'react';
import axios from '../axios.js';
import close from '../img/icons/close.png'
import list from '../img/icons/list.png'
import {useNavigate} from "react-router-dom";
import './header.css'
import './normalize.css'
import cart from '../img/icons/cart.png'
import settings from '../img/icons/settings.png'
import {Link} from "react-router-dom";

export default function Header() {
	const [user, setUser] = React.useState('')
	
	// const getToken = async () => {
	// 	await axios.get('../sanctum/csrf-cookie').then(res =>{
	// 	})
	// }

	const getUser = async () => {
		await axios.get('/auth/me').then(res =>{
			setUser(res.data)
			setAuth(true)
		}).catch()
	}

	React.useEffect(() =>{

		getUser()

	}, [])
	const onClickLogout = async () =>{
		if(window.confirm('Вы действительно хотите выйти?')){
			// dispatch(logout())

			await axios.get('/auth/logout').then(res =>{
				navigate(0)
			})
			navigate(0)
		}
		
	}

	const [cartLength, setCartLength] = React.useState()
	const [cartEmpty, setCartEmpty] = React.useState(true)
	React.useEffect(() =>{
		if(JSON.parse(localStorage.getItem ('cart')) !== null){
			setCartLength(JSON.parse(localStorage.getItem ('cart')).length)
			setCartEmpty(false)
		}
	}, [])
	const ids = window.location.href;
	const [auth, setAuth] = React.useState(false)
	// const [auth, setAuth] = React.useState(0)
	const [login, setLogin] = React.useState(false)
	const [register, setRegister] = React.useState(false)

	const popUpClose = () => {
		setErrors([])
		document.body.style.overflowY = "visible";
	}

	const loginClick = async () => {
		closeRegister()
		setLogin(true)
		document.body.style.overflowY = "hidden";
	}

	const closeLogin = async () =>{
		setLogin(false);
		popUpClose()
		
	}
	const registerClick = async () => {
		closeLogin()
		setRegister(true)
		document.body.style.overflowY = "hidden";
	}
	const closeRegister = async () =>{
		setRegister(false);
		popUpClose()
		
	}
	const closePopUp = async() =>{
		setRegister(false);
		setLogin(false);
		popUpClose()
	}
	const [authAttempt, setAuthAttempt] = React.useState(0)
	const [incorrectLogin, setIncorrectLogin] = React.useState(false)
	const [incorrectRegister, setIncorrectRegister] = React.useState(false)
	const [phone, setPhone] = React.useState('')
	const [password, setPassword] = React.useState('')
	const [name, setfullName] = React.useState('')
	const navigate = useNavigate()

	const onLogin = async () => {
		try {
			if(authAttempt > 3){
				alert('Вы ввели более 5 раз неверный телефон или пароль!\n\nПерезапустите страницу!')
				return false
			}
			const fields = {
				phone, password
			}

			axios.post('/auth/login', fields).then(res =>{
				window.localStorage.setItem('token', res.data.token)
				navigate(0)
			}).catch(()=>{
				setErrors(['Неверный номер телефона или пароль'])
				setIncorrectLogin(true)
			})
				
		} catch (err) {
			console.warn(err);
			setAuthAttempt((attempt) => attempt + 1)
			setIncorrectLogin(true)
		}
		
	}
	const [errors, setErrors] = React.useState([]);
	const [isAdmin, setIsAdmin] = React.useState(false);
	const [code, setCode] = React.useState(false);

	const onRegister = async () => {
		try {

			if (name.lastIndexOf('admin_') === 0 && isAdmin == false){
				setIsAdmin(true)
				return
			}

			
			if (name.lastIndexOf('admin_') === 0){

				const fields = {
					phone, password, name, code
				}

				await axios.post('/auth/register/admin', fields).then(res =>{
					window.localStorage.setItem('token', res.data.token)
					navigate(0)
				}).catch(res => {
					let errorsData = res.response.data.errors
					let errors = Object.values(errorsData).map(error => [error[0]]);
					setErrors(errors)
					setIncorrectRegister(true)
				})
				
				return
			}
			
			const fields = {
				phone, password, name
			}

			await axios.post('/auth/register', fields).then(res =>{
				window.localStorage.setItem('token', res.data.token)
				navigate(0)
			}).catch(res => {
				let errorsData = res.response.data.errors
				let errors = Object.values(errorsData).map(error => [error[0]]);
				setErrors(errors)
				setIncorrectRegister(true)
			})
			
		} catch (err) {
			console.warn(err);
		}
		
	}

	const submitInput = (e) =>{
		e.preventDefault();
		if (login) {
			onLogin()
		}
		if (register){
			onRegister()
		}
        return false;
	}
	return (
	<container>
		{true &&(
		// {auth === 1 || auth === 2 &&(
			<>
			<header>
			<div className="page-links">
				<button onClick={closePopUp} className='header-link'><Link to='/'><h3 className='header-links'>Главная</h3></Link></button>
				<button onClick={closePopUp} className='header-link category cakes'><Link to='/cakes'><h4 className='header-links'>Торты</h4></Link></button>
				<button onClick={closePopUp} className='header-link category candies'><Link to='/candies'><h4 className='header-links'>Конфеты</h4></Link></button>
				<button onClick={closePopUp} className='header-link category ice-cream'><Link to='/ice-cream'><h4 className='header-links'>Мороженое</h4></Link></button>
				<button onClick={closePopUp} className='header-link category desserts'><Link to='/desserts'><h4 className='header-links'>Десерты</h4></Link></button>
			</div>
			<div className="user-links">
			{auth ?(
				<>
				<button onClick={closePopUp}><Link to='/favorites'><h3 className='header-links favorites'>Избранное</h3></Link></button>
				<button onClick={closePopUp}><Link to='/history'><h3 className='header-links'>{user.name}</h3></Link></button>
				<button onClick={closePopUp}><h3 className='header-links' onClick={onClickLogout}>Выйти</h3></button>
				{(user.role === 'moderator' || user.role === 'admin') &&(
					<>
						{/* <Link to='/admin/list' className='settings-link orders'><img src={list} alt="" width='40px' height='40px'/></Link> */}
						<Link to='/admin' className='settings-link'><img src={settings} alt="" width='40px' height='40px'/></Link>
					</>
				)}
				</>
			):(
				<>
				<button className="header-links" onClick={loginClick}><h3>Войти</h3></button>
				</>
			)}
			<Link to='/cart'  onClick={closePopUp}>
				<div className="circle">
				<img src={cart} alt="" width='65%' height='65%'/>
				{!cartEmpty &&(
				<div className="circle-after">{cartLength}</div>
				)}
				</div>
			</Link>
			</div>
		</header>
		{login&&(
			<>
			<div className="popup" onClick={closeLogin}>
				
			</div>
			<div className="popup-item">
				<button className='popup-close' onClick={closeLogin}><img src={close} alt="" width='28' height='28'/></button>
				<p className='header-popup__title'>Авторизация</p>
				{incorrectRegister && errors.map((obj, index) =>(
					<p className='incorrect'>{obj}</p>)
				)}
				<form className='cart-form' onSubmit={submitInput}>
					<label for='phone-input' style={{fontSize : 20, marginBottom: 10, marginTop: 30}}><p>Введите номер телефона</p></label>
					<input type="phone" id='phone-input' className='header-input' onChange ={(e) => setPhone(e.target.value)}/>
				</form>
				<form className='cart-form' onSubmit={submitInput}>
					<label for='password-input' style={{fontSize : 20, marginBottom: 10, marginTop: -40}}><p>Введите пароль</p></label>
					<input type="password" id='password-input' className='header-input' onChange ={(e) => setPassword(e.target.value)}/>
				</form>

				<button className='btn-login'  style={{marginTop: -20}} onClick={onLogin}>Войти</button>	
				<p className='header-links-black' onClick={registerClick}>Зарегистрироваться</p>
			</div>
			</>
		)	
		}
		{register&&(
			<>
			<div className="popup" onClick={closeRegister}>
				
			</div>
			<div className="popup-item">
				<button className='popup-close' onClick={closeRegister}><img src={close} alt="" width='28' height='28'/></button>
				<p className='header-popup__title'>Регистрация</p>
				{incorrectRegister && errors.map((obj, index) =>(
					<p className='incorrect'>{obj[0]}</p>)
				)}
				<form className='cart-form' onSubmit={submitInput}>
					<label for='name-input' style={{fontSize : 20, marginBottom: 10, marginTop: 0}}><p>Введите имя</p></label>
					<input type="text" id='name-input' className='header-input' onChange ={(e) => setfullName(e.target.value)}/>
				</form>
				<form className='cart-form' onSubmit={submitInput}>
					<label for='phone-input' style={{fontSize : 20, marginBottom: 10, marginTop: -50}}><p>Введите номер телефона</p></label>
					<input type="phone" id='phone-input' className='header-input' onChange ={(e) => setPhone(e.target.value)}/>
				</form>
				<form className='cart-form' onSubmit={submitInput}>
					<label for='password-input' style={{fontSize : 20, marginBottom: 10, marginTop: -50}}><p>Введите пароль</p></label>
					<input type="password" id='password-input' className='header-input' onChange ={(e) => setPassword(e.target.value)}/>
				</form>

				{isAdmin ? (
					<>
					<form className='cart-form' onSubmit={submitInput}>
						<label for='code-input' style={{fontSize : 20, marginBottom: 10, marginTop: -60}}><p>Введите код</p></label>
						<input type="password" id='code-input' className='header-input' onChange ={(e) => setCode(e.target.value)}/>
					</form>
					<button className='btn-login register' onClick={onRegister} style={{marginBottom: -10, marginTop: -60}}>Зарегистрироваться</button>
				</>
				): (
					<button className='btn-login register' onClick={onRegister}>Зарегистрироваться</button>
				)}
				<p className='header-links-black' onClick={loginClick}>Войти</p>
			</div>
			</>
		)
		}
		</>
		)}
		
	</container>

	);
  };
