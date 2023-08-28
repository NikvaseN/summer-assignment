import Header from '../components/header.jsx';
import '../components/normalize.css'
import '../components/cart.css'
import axios from '../axios.js';
import React from 'react';
import {useNavigate } from 'react-router-dom';
import close from '../img/icons/close.png'
export default function Cart() {
	const navigate = useNavigate ()
	let cartEmpty = true
	let cartItems
	if(JSON.parse (localStorage.getItem ('cart')) !== null){
		cartItems = JSON.parse (localStorage.getItem ('cart'))
		cartEmpty = false
	}
	else{
		cartItems = []
		// cartItems = [{"value":1,"product":{"_id":"6377987a6359d93c2c7e31ca","name":"Клубничная башня","price":"1598","category":{"_id":"637871432dc9c0dfd59e467d","name":"cakes","createdAt":"2022-11-19T06:01:39.632Z","updatedAt":"2022-11-19T06:01:39.632Z","__v":0},"imageUrl":"/uploads/cakes/town.png","composition":"Пшеничная мука, яйца, сахар, сливочное масло, молоко, соль","createdAt":"2022-11-18T14:36:42.642Z","updatedAt":"2022-11-18T14:36:42.642Z","__v":0}}]
	}
	let startValue = ['-1']
	if(startValue[0] === '-1'){
		for (let i = 0; i < cartItems.length; i++ ){
			startValue[i] = cartItems[i].value;
		}
	}
	let startPrice = ['-1']
	if(startPrice[0] === '-1'){
		for (let i = 0; i < cartItems.length; i++ ){
			startPrice[i] = parseInt(cartItems[i].product.price) * cartItems[i].value
		}
		var startFullPrice = 0 
		for (let i = 0; i < cartItems.length; i++ ){
			startFullPrice += startPrice[i];
		}
		
	}
	
	const [value, setValue] = React.useState(startValue)
	const [price, setPrice] = React.useState(startPrice)
	const [methodDelivery, setMethodDelivery] = React.useState()
	const [deletedItems, setDeletedItems] = React.useState([])
	
	const deleteItemCart = (index) => {
		if(cartItems.length === 1){
			window.localStorage.removeItem('cart')
		}
		else{
			cartItems = JSON.parse (localStorage.getItem ('cart'))
			cartItems.splice(index,1);
			value.splice(index,1);
			price.splice(index,1);
			setFullPriceFunc();
			window.localStorage.setItem('cart', JSON.stringify(cartItems))
		}
		if(deletedItems[0] === undefined){
			let deletedItem = []
			deletedItem[deletedItems.length] = index
			setDeletedItems([...deletedItem])
		}
		else{
			let deletedItem = deletedItems
			deletedItem[deletedItems.length] = index
			setDeletedItems([...deletedItem])
		}
	}
	const setValueUp = (index) =>{
		if(value[index] < 100){
			let valueT = value
			valueT[index] = valueT[index] + 1
			let priceT = price
			priceT[index] = parseInt(priceT[index]) + parseInt(cartItems[index].product.price) 
			setValue(valueT)
			setPrice(priceT)
			setFullPriceFunc()
			let data = JSON.parse(localStorage.getItem ('cart'))
			data[index].value = data[index].value + 1
			window.localStorage.setItem('cart', JSON.stringify(data))
			
		}
	}
	const setFullPriceFunc = async () =>{
		let fullprice = 0
		for (let i = 0; i < cartItems.length; i++ ){
			fullprice += parseInt(price[i]);
		}
		setFullPrice(fullprice)
	}
	const setValueDown = async (index) =>{
		if(value[index] > 1){
			let valueT = value
			valueT[index] = valueT[index] - 1
			let priceT = price
			priceT[index] = parseInt(priceT[index]) - parseInt(cartItems[index].product.price) 
			setValue(valueT)
			setPrice(priceT)
			setFullPriceFunc()
			let data = JSON.parse(localStorage.getItem ('cart'))
			data[index].value = data[index].value - 1
			window.localStorage.setItem('cart', JSON.stringify(data))

		}
	}
	const [fullPrice, setFullPrice] = React.useState(startFullPrice)

	const methodDeliveryDelivery = async () =>{
		setMethodDelivery('delivery')
	}
	const methodDeliveryPickup = async () =>{
		setMethodDelivery('pickup')
	}

	const checkActiveItem = async (index) =>{
		let deletedItemsArr = deletedItems
		for (let i = 0; i < deletedItemsArr.length; i++){
			if(index === deletedItemsArr[i]){
				return false
			}
		}
		return true
	}
	const [user, setUser] = React.useState('')
	React.useEffect(() =>{
		document.title = "Корзина"
		axios.get('/auth/me').then(res =>{
			setUser(res.data)
		}).catch()
	}, [])
	const [username, setUsername] = React.useState ()
	const [phone, setPhone] = React.useState ()
	const [adress, setAdress] = React.useState ()
	const [validationPhoneFailed, setValidationPhoneFailed] = React.useState (false)
	const [validationAdressFailed, setValidationAdressFailed] = React.useState (false)

	const audio = new Audio('/sounds/notification.mp3');
	
	const sendOrder = async () =>{
		let products = cartItems.map(item => {
			return {
				value: item.value,
				product: item.product.id
			};
		});

		let fields
		if(user !== ''){
			fields = {
				username, phone, adress, methodDelivery, fullPrice, products, user: user.id
			}
		}
		else{
			fields = {
				username, phone, adress, methodDelivery, fullPrice, products
			}
		}
		await axios.post('/orders', fields).then(
			window.localStorage.removeItem('cart'),
			audio.play(),
			user ? navigate('/history') : navigate('/')
		)
	}
	const order = async () =>{
		if(methodDelivery === 'delivery'){
			let validationPhone = phone + ''
			let validationAdress = adress + ''
			if(validationPhone.length === 11 && validationAdress.length > 6 && validationAdress !== 'undefined'){
				sendOrder()
			}
			else{
				if(validationPhone.length !== 11){
					setValidationPhoneFailed(true)
				}
				else{
					setValidationPhoneFailed(false)
				}
				try{
					if(validationAdress.length <= 6 || validationAdress === 'undefined'){
						setValidationAdressFailed(true)
					}
					else{
						setValidationAdressFailed(false)
					}
				}
				catch{
					setValidationAdressFailed(true)
				}
			}
		}
		else if (methodDelivery === 'pickup'){
			sendOrder()
		}
	}
	const [defaultName, setDefaultName] = React.useState('')
	const [defaultPhone, setDefaultPhone] = React.useState('')
	const DataUser = () =>{
		setDefaultName(user.name)
		setDefaultPhone(user.phone)
		setPhone(user.phone)
		setUsername(user.name)
	}

	//
	const [easterNum, setEasterNum] = React.useState(1)
	const easter = () =>{
		setEasterNum(easterNum + 1)
		if(easterNum > 9){
			navigate("/gif")
		}
	}
	//
	let main = []
	const setMain = () =>{
		main.push(
			!cartEmpty ? (
				<>
				<p style={{fontSize : 36}} onClick={easter}>Ваш заказ</p>
				<div className="hr"></div>
				
				{(cartItems).map((obj, index) => (
					checkActiveItem(index) && (
					<div className="cart-item">
					<img src={`${process.env.REACT_APP_IMG_URL}${obj.product.imageUrl}`} alt="" width={383} height={260}/>
					<div className="cart-item-text">
						<h2 style={{fontSize : 30, marginTop:15}}>{obj.product.name}</h2>
						<h3 style={{marginBottom : 60, marginTop: 45}}>Состав: <span>{obj.product.composition}</span> </h3>
						<div className="price-block">
							<div className="quantity-items pag-cart">
								<button style={{ fontSize : 40, marginTop:-10}} onClick={() => setValueDown(index)}>-</button>
								<p>{value[index]}</p>
								{/* <input type="text" defaultValue={value} onChange ={(e) => setPag(e.target.value)}/> */}
								<button style={{ fontSize : 40, marginTop:-2} } onClick={() => setValueUp(index)} >+</button>
							</div>
							<h3>{price[index]} ₽</h3>
						</div>
							
						</div>
					<button className='close-item-cart' onClick={() => deleteItemCart(index)}><img src={close} alt="" width='28' height='28'/></button>
				</div>
					)
				))}
				
				<h2>ИТОГО: {fullPrice} ₽</h2>
				<p style={{fontSize : 30, marginTop: 80}}>Оформление заказа</p>
				<div className="hr" style={{marginTop: 50}}></div>
				<p style={{fontSize : 28, marginBottom: 50}}>Способ доставки</p>
				<div className="method-delivery-cart" >
					<button className='btn-add-cart' onClick={() => methodDeliveryDelivery()}>Доставка</button>
					<button className='btn-add-cart' onClick={() => methodDeliveryPickup()}>Самовывоз</button>
				</div>
				{methodDelivery === 'delivery' && (
				<>
					<p style={{fontSize : 28, marginBottom: 50}}>Личные данные</p>
					<button className='btn-use-data' onClick={() => DataUser()}>Использовать сохраненные данные</button>
					<form className='cart-form'>
						<label for='name-input' style={{fontSize : 28, marginBottom: 50, textAlign: 'center'}} className='input-order'>Введите имя</label>
						<input type="text" id='name-input' className='cart-input' defaultValue={defaultName} onChange ={(e) => setUsername(e.target.value)}/>
					</form>
					<form className='cart-form'>
						<label for='phone-input' className='input-order'>Номер телефона</label>
						{validationPhoneFailed &&(
							<p className='validationEror'>Введите номер телефона</p>
						)}
						<input type="text" id='phone-input' className='cart-input' defaultValue={defaultPhone} onChange ={(e) => setPhone(e.target.value)}/>
					</form>
					<form className='cart-form'>
						<label for='adress-input' className='input-order'>Адрес доставки</label>
						{validationAdressFailed &&(
							<p className='validationEror'>Введите адрес</p>
						)}
						
						<input type="text" id='adress-input' className='cart-input' onChange ={(e) => setAdress(e.target.value)}/>
					</form>
					<button className='btn-add-cart' onClick={() => order()}>Заказать</button>
				</>
				)}
				{(methodDelivery === 'pickup' &&(
					<>
					<p style={{fontSize : 28, marginBottom: 50}}>Самовывоз</p>		
					<p style={{fontSize : 22, marginBottom: 50}}>Вы можете подтвердить заказ и приехать к нам в магазин для оплаты и получения заказа</p>		
					<p style={{fontSize : 22, marginBottom: 50}}>Адрес: Ул. Ленина 5А</p>
					<p style={{fontSize : 22, marginBottom: 50}}>График:</p>
					<p style={{fontSize : 22, marginBottom: 50}}>Пн 08:30–20:00 <br />
						
						Вт 08:30–20:00 <br />
						Ср 08:30–20:00 <br />
						Чт 08:30–20:00 <br />
						Пт 08:30–20:00 <br />
						Сб Выходной<br />
						Вс Выходной <br />
	</p>
					<iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3A26813f20f39c4e90d9bb358c11190faea4af213cb57baa04cd8c56df455d132e&amp;source=constructor" width="950" height="400" frameborder="0"></iframe>
					<button className='btn-add-cart' style={{marginTop: 50}} onClick={() => order()}>Заказать</button>		
					</>
				)
				)}
				</>
				):(
					<h1>В корзине пусто</h1>
				)
				
		)
	}
	setMain ()
	return (
		<container>
			{/* <Header/> */}
			<div className="empty-header"></div>
			{main}
			
		</container>
	);
  };
