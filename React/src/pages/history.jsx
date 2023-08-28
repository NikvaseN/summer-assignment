import Header from '../components/header.jsx';
import '../components/normalize.css'
import '../components/history.css'
import load from "../img/icons/load.gif"
import undefined from "../img/icons/undefined.webp"
import axios from '../axios.js';
import {Link} from "react-router-dom";
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
export default function History() {
	const [historyEmpty, setHistoryEmpty] = React.useState(true)
	const [pageLoad, setPageLoad] = React.useState(false)
	const navigate = useNavigate()
	const [data, setUser] = React.useState('')
	const [orders, setOrders] = React.useState([])
	const getData = (id) =>{
		axios.get('/orders/history').then(res =>{
			if(res.data[0] !== undefined){
				setHistoryEmpty(false)
			}
			setOrders(res.data.reverse())
			setPageLoad(true)
		})
	}

	React.useEffect(() =>{
		document.title = "История заказов"
		axios.get('/auth/me').then(res =>{
			setUser(res.data)
			getData()
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
	const repeat = (products) =>{
		window.localStorage.setItem('cart', JSON.stringify(products))
		navigate('/cart')
	}
	
	const cancel = async (e, id) =>{
		e.stopPropagation();
		let ordersT = orders
		for (let i=0; i < ordersT.length; i++){
			if(ordersT[i]._id === id){
				ordersT.splice(i,1);
			}
		}
		setOrders([...ordersT])

		await axios.delete(`/orders/${id}`)
	}

	let main = []
	let icon_status = []
	const cheackStatus = (status) =>{
		icon_status = []
		let Class = 'icon_status ' + status

		icon_status.push(
			<div className={Class} ></div>
		)

		switch (status){
			case 'new':
				return 'Проверка'
			case 'pending':
				return 'В пути'
			case 'canceled':
				return 'Отменен'
			case 'ended':
				return 'Завершен'
		}

	}

	const setMain = () =>{
		main.push(
			<>
				<p style={{fontSize : 36}}>Ваши заказы</p>
				<div className="hr"></div>
				{(orders).map((obj, index) => (
					!cheackOpenItem(index) ? (
						<div className="history-item" onClick={() => setOpenedItems(index)}>
							{day(obj.created_at)}
							{hour(obj.created_at)}
							{fullDate(index)}
							<p>№ {obj.id}</p>
							{/* <p style={{width:90}}>{cheackStatus(obj.status)}</p> */}
							{/* {icon_status} */}
							<p className='history-order__date'>{day_date[index]}</p>
							<p>{hour_date[index]}</p>
							<p className='header-links-black'>{quantity(obj.order_products.length)}</p>
							<p className='history-order__fullPrice'>Итого: <span style={{ marginLeft:18}}>{obj.fullPrice} ₽</span></p>

							{/* {obj.status === 'new' ?
								(<div className="repeat cancel" onClick={(e) => cancel(e, obj._id)}>Отменить</div>)
								:
								(<div className="repeat" onClick={() => repeat(obj.products)}>Повторить</div>)
							} */}

							<div className="repeat" onClick={() => repeat(obj.order_products)}>Повторить</div>
						</div>
					):(
						<div className="history-item open" onClick={() => setOpenedItems(index)}>
							{day(obj.created_at)}
							{hour(obj.created_at)}
							{fullDate(index)}
							<div className="history-item-title">
								<p>№ {obj.id}</p>
								{obj.methodDelivery === 'delivery' ? (<><p>Доставка</p><p>{obj.adress}</p></>) : (<p>Самовывоз</p>) }
								<p>{day_date[index]}</p>
								<p>{hour_date[index]}</p>
							</div>
							{/* {obj.methodDelivery === 'delivery' ? 
								(<>
								<div className="history-item-title user">
									<p>Доставка</p>
									<p>{obj.username}</p>
									<p>{obj.phone}</p>
								</div>
								<div className="hr-small"></div>
								<div className="history-item-title">
								<p>№ 123</p>
								<p>{obj.adress}</p>
								<p>{day_date[index]}</p>
								<p>{hour_date[index]}</p>
							</div>
								</>
								)	
								:(
									<>
									<div className="history-item-title center">
										<p>Самовывоз</p>
									</div>
									<div className="hr-small"></div>
									<div className="history-item-title user">
										<p>№ 123</p>
										<p>{day_date[index]}</p>
										<p>{hour_date[index]}</p>
									</div>
								</>
								)
							} */}
							<div className="hr-medium history"></div>
							{(obj.order_products).map((obj, index) => (
								obj.product ? (
								<div className="cart-item history">
									<img src={`${process.env.REACT_APP_IMG_URL}${obj.product.imageUrl}`} alt="" width={300} height={220}/>
									<div className="cart-item-text">
										<h2 className='history-item__name'>{obj.product.name}</h2>
										<h5 className='history-item__composition' >Состав: <span>{obj.product.composition}</span> </h5>
										<div className="price-box item-price">
											<p><span style={{color: 'grey'}}>{obj.value} x</span> {obj.product.price} ₽</p>
											<p className='history-item__fullPrice'>{obj.value * obj.product.price} ₽</p>
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
							<div className="hr-medium history lower"></div>
							<div className="price-box">
								<h3>Итого: {obj.fullPrice}</h3>
								{obj.status === 'new' ?
								(<button className="btn-repeat cancel history" onClick={(e) => cancel(e, obj._id)}>Отменить</button>)
								:
								(<button className="btn-repeat history" onClick={() => repeat(obj.order_products)}>Повторить</button>)
							}
								</div>
							
						</div>
					)
					
				))}
			</>
		)
	}
	setMain ()
	return (
		<container>
			{/* <Header/> */}
			<div className="empty-header"></div>
			{pageLoad ? 
			(
				historyEmpty ?
				(
				<>
					<p style={{fontSize : 30, textAlign: 'center'}}>Вы ещё не делали заказов!<br /></p>
					<Link to='/' style={{fontSize : 30, textAlign: 'center'}} className='header-links-black'>Давайте это исправим!</Link>
				</>
				) 
				: 
				(main)
			)
			: 
			(
				<img src={load} alt="load" />
			)
			 }
			
		</container>
	);
  };
