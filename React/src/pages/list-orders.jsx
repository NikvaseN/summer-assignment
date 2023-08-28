import Header from '../components/header.jsx';
import '../components/normalize.css'
import '../components/history.css'
import load from "../img/icons/load.gif"
import undefined from "../img/icons/undefined.webp"
import axios from '../axios.js';
import {Link} from "react-router-dom";
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
// import {useNavigate } from 'react-router-dom';
// import close from '../img/icons/close.png'
export default function List_orders() {
	const [historyEmpty, setHistoryEmpty] = React.useState(true)
	const [pageLoad, setPageLoad] = React.useState(false)
	const navigate = useNavigate()
	const [user, setUser] = React.useState('')
	const [orders, setOrders] = React.useState([])

	const getData = (id) =>{
		axios.get('/orders/active').then(res =>{
			if(res.data[0] !== undefined){
				setHistoryEmpty(false)
			}
			setOrders(res.data.reverse())
			setPageLoad(true)
		})
	}

	React.useEffect(() =>{
		document.title = "Список заказов"
		axios.get('/auth/me').then(res =>{
			setUser(res.data)
			getData(res.data._id)
		}).catch(() => {
			setPageLoad(true)
		})	
	}, [])

	const [openItems,setOpenItems] = React.useState([])
	const setOpenedItems = async (index) =>{
		let openItemsT = openItems
		let open = false
		for (let i=0; i < openItems.length; i++){
			if(openItems[i] === index){
				open = true
				openItemsT.splice(i,1);
			}
		}
		if(!open){
			openItemsT[openItemsT.length] = index
		}
		setOpenItems([...openItemsT])
		cheackOpenItem()
	}
	const cheackOpenItem = (index) =>{
		for (let i=0; i < openItems.length; i++){
			if(openItems[i] === index){
				return true
			}
		}
		return false
	}
	
	// Дата и время
	var date_day = [];
	var date_hour = [];
	var day_date = [];
	var hour_date = [];
	let day = function (text){
		date_day = []
		for (let i = 0; i < 10; i++){
			date_day += '' + text[i];
		  }
	}
	let hour = function (text){
		date_hour = []
		if ((Number(text[11]+text[12]) + 8) > 24){
			date_hour = '0' + (Number(text[11]+text[12]) + 8 - 24)
		}
		else {
			date_hour = '' + (Number(text[11]+text[12]) + 8)
		}
		for (let i = 13; i < 16; i++){
			date_hour +=  '' + text[i];
		}
	}
	let fullDate = function (index){
		day_date[index] = date_day;
		hour_date[index] = date_hour;
	}

	const quantity = (n) =>{
		n = Math.abs(n) % 100; 
		let n1 = n % 10;
		let str = ''
		if(n1 > 1 && n1 < 5){
			str = ' товара'
		}
		else if(n > 10 && n < 20){
			str = ' товаров'
		}
		else if(n1 === 1){
			str = ' товар'
		}
		else{
			str = ' товаров'
		}
		return (n + str)
	}

	const [target, setTarget] = React.useState('new')

	// Бесконечная прокрутка
	const [skip, setSkip] = React.useState(0)

	let limit = 5

	const getEndedOrders = async (skip) =>{
		let fields = {
			limit, skip
		}
		await axios.post('/orders/ended', fields).then(res =>{
			if (skip !== 0){
				setOrders((prevData) => [...prevData, ...res.data]);
			}
			else{
				setOrders([...res.data])
			}
		})
	}

	const addEndedOrders = () =>{
		setSkip((e) => e + limit)
		getEndedOrders(skip + limit)
	}

	//

	const changeTarget = (status, e) =>{
		if(status !== target){
			let btns = document.getElementsByClassName('favorites-btn')

			// Т.к. при загрузке завершенные заказов, очищаются активные заказы, то их нужно обновить
			if(target === 'ended'){
				axios.get('/orders/active').then(res =>{
					setOrders(res.data.reverse())
				})
			}
			setTarget(status)
	
			for(let i=0; i<btns.length; i++){
				btns[i].classList.remove("focus");
			}
	
			e.target.classList.add("focus");
			
			if(status === 'ended'){
				getEndedOrders(0)
			}
		}
	}

	let main = []
	let icon_status = []
	const cheackStatus = (status) =>{
		icon_status = []
		let Class = 'icon_status admin ' + status

		icon_status.push(
			<div className={Class} ></div>
		)
	}
	const cheackActive = (status) =>{
		if(target === 'ended'){
			if (status === target || status === 'canceled'){
				return true
			}
		}
		else if (status === target){
			return true
		}
		return false
	}
	const changeStatus = (e, id) =>{
		e.stopPropagation();
		if (target === 'new'){
			setActive(id);
		}
		if(target === 'pending'){
			setEnded(id);
		}
	}

	const setCancel = async (e, id) =>{
		e.stopPropagation();
		let ordersT = orders
		ordersT.find((el, i) => {
			if (el._id === id) {
				ordersT[i].status = 'cancel'
				return true; 
			}
		});
		setOrders([...ordersT])

		let status = 'canceled'
		const fields = {
			status
		}
		await axios.patch(`/orders/setStatus/${id}`, fields)
	}

	const setActive = async (id) => {
		let ordersT = orders
		ordersT.find((el, i) => {
			if (el._id === id) {
				ordersT[i].status = 'pending'
				return true; // stop searching
			}
		});
		setOrders([...ordersT])

		let status = 'pending'
		const fields = {
			status
		}
		await axios.patch(`/orders/setStatus/${id}`, fields)
		
	}
	const setEnded = async (id) => {
		let ordersT = orders
		ordersT.find((el, i) => {
			if (el._id === id) {
				ordersT[i].status = 'ended'
				return true; // stop searching
			}
		});
		setOrders([...ordersT])

		let status = 'ended'
		const fields = {
			status
		}
		await axios.patch(`/orders/setStatus/${id}`, fields)
	}

	const setMain = () =>{
		main.push(
			<>
				{(orders).map((obj, index) => (

				cheackActive(obj.status) && (
					!cheackOpenItem(index) ? (
						<div className="history-item admin" onClick={() => setOpenedItems(index)}>
							{day(obj.createdAt)}
							{hour(obj.createdAt)}
							{fullDate(index)}
							<p>№ {obj.number}</p>
							{obj.methodDelivery === 'delivery' ? (<p>Доставка</p>) : (<p>Самовывоз</p>) }
							<p>{hour_date[index]}</p>
							{cheackStatus(obj.status)}
							{icon_status}
							<p style={{marginLeft:60,marginRight:60 }} className='header-links-black'>{quantity(obj.products.length)}</p>
							<p>Итого: <span style={{ marginLeft:18}}>{obj.fullPrice} ₽</span></p>
							{target !== 'ended'&&
								<>
									<div className="repeat admin-cancel " onClick={(e) => setCancel(e, obj._id)}>Отменить</div>
									<div className="repeat admin-accept" onClick={(e) => changeStatus(e, obj._id)}>Подтвердить</div>
								</>
							}

						</div>
					):(
						<div className="history-item open" onClick={() => setOpenedItems(index)}>
							{day(obj.createdAt)}
							{hour(obj.createdAt)}
							{fullDate(index)}
							<div className="history-item-title">
								<p>№ {obj.number}</p>
								{obj.methodDelivery === 'delivery' ? (<><p>Доставка</p><p>{obj.adress}</p></>) : (<p>Самовывоз</p>) }
								<p>{day_date[index]}</p>
								<p>{hour_date[index]}</p>
							</div>
							<div className="hr-medium"></div>
							{(obj.products).map((obj, index) => (
								obj.product ? (
								<div className="cart-item history">
									<img src={`${process.env.REACT_APP_IMG_URL}${obj.product.imageUrl}`} alt="" width={300} height={220}/>
									<div className="cart-item-text">
										<h2 style={{fontSize : 24, marginTop:15}}>{obj.product.name}</h2>
										<h5 style={{marginBottom : 60, marginTop: 45}}>Состав: <span>{obj.product.composition}</span> </h5>
										<div className="price-box">
											<p><span style={{color: 'grey'}}>{obj.value} x</span> {obj.product.price} ₽</p>
											<p>{obj.value * obj.product.price} ₽</p>
										</div>
									</div>
								</div>
								) :
								(
									<div className="cart-item history">
										<img src={undefined} alt="" width={300} height={220}/>
										<div className="cart-item-text">
											<h2 style={{fontSize : 24, marginTop:15}}>Товар не найден</h2>
											<h5 style={{marginBottom : 60, marginTop: 45}}>Данный товар больше не продаётся</h5>
										</div>
									</div>
								)
								))
							}
							<div className="hr-medium"></div>
							{obj.user?
								<div className="history-item-title">
									<p>ФИО: {obj.user.fullName}</p>
									<p>Телефон: {obj.user.phone}</p>
									{obj.user.role === 'user' ? (<p>Пользователь</p>) : (<p>Сотрудник</p>) }
								</div>
								:
								<div className="history-item-title">Гость</div>
							}
							
							<div className="hr-medium"></div>
							<div className="price-box">
								<h3>Итого: {obj.fullPrice}</h3>
								<button className="btn-repeat" onClick={(e) => changeStatus(e, obj._id)}>Подтвердить</button>
								</div>
							
						</div>
					))
					
				))}
			</>
		)
	}
	setMain ()
	return (
		<container>
			<div className="empty-header"></div>

			{
			user && (user.role === 'moderator' || user.role === 'admin') ? (
			pageLoad ? 
			(
				historyEmpty ?
				(
				<>
					<p style={{fontSize : 30, textAlign: 'center'}}>Список заказов пуст<br /></p>
				</>
				) 
				:
				<>
				<p style={{fontSize : 36}}>Заказы</p>
				<div className="hr list-orders"></div>
				<div className="favorites-navbar list">
					<div className="btn-add-cart favorites-btn focus" onClick={(e) => changeTarget('new', e)}>Новые</div>
					<div className="btn-add-cart favorites-btn" onClick={(e) => changeTarget('pending', e)}>Активные</div>
					<div className="btn-add-cart favorites-btn" onClick={(e) => changeTarget('ended', e)}>Завершенные</div>
				</div>
				{main}


				{target === 'ended' &&
					<button className="btn-repeat" style={{backgroundColor:'#2F2F2F', width:'200px', borderRadius:'3em'}} onClick={() => addEndedOrders()}>Загрузить ещё</button>
				}
			</>
			)
			: 
			(
				<img src={load} alt="load" />
			)) :
			(navigate('/404')
			)
			 }
			
		</container>
	);
  };
