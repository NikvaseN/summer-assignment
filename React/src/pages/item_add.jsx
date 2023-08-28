import '../components/normalize.css'
import '../components/favorites.css'
import '../components/item_add.css'
import plus from '../img/icons/plus.png'
import React from 'react';
import axios from '../axios.js';
export default function Item_add() {
	const [user, setUser] = React.useState()
	React.useEffect(()=>{
		document.title = "Добавить товар"
		axios.get('/auth/me').then(res =>{
			setUser(res.data)
		})
	}, [])
	const cakes = '1'
	const candies = '2'
	const ice_cream = '3'
	const dessert = '4'
	const [target, setTarget] = React.useState(0)
	const [name, setName] = React.useState('Название')
	const [price, setPrice] = React.useState(0)
	const [composition, setComposition] = React.useState('')

	const changeTarget = (category, e) =>{
		let btns = document.getElementsByClassName('favorites-btn')
		setTarget(category)
		for(let i=0; i<btns.length; i++){
			btns[i].classList.remove("focus");
		}
		e.target.classList.add("focus");
	}

	// Пробел после тысяч
	// const setprice = (e) =>{
	// 	let price = e.target.value
	// 	price = parseInt(price)
	// 	price = price.toLocaleString('ru-RU')
	// 	if(price === "не число"){
	// 		price = 0
	// 	}
	// 	setPrice(price)
	// }

	// Файлы
	const inputFileRef = React.useRef(null)
	const [imageUrl, setImageUrl] = React.useState('');
	const handleChangeFule = async (event) => {
		try{
			const formData = new FormData();
			const file = event.target.files[0]
			formData.append('image', file);
			const { data } = await axios.post('/uploads', formData); 
			setImageUrl(data)

		} catch (err) {
			console.warn(err);
			alert('Ошибка при загрузке файла')
		}
	}

	const save = async () =>{
		let category = target 
		const fields = {
			// name, price, category, composition
			name, price, category, composition, imageUrl
		}
		// if(name === 'Название' || price === 0 || category === 0 || composition === ''){
		if(name === 'Название' || price === 0 || category === 0 || composition === '' || imageUrl === ''){
			alert('Заполните все поля ❌')
		}
		else{
			await axios.post('/products', fields)
			alert('Успешно ✅')
		}
	}
	return (
		<container>
		<div className="empty-header"></div>
		{user&&
		(user.role === 'moderator' || user.role === 'admin') &&(
			<main className='item-add_container'>
			<p style={{fontSize : 36}}>Добавить товар</p>
			<div className="hr hr-favorites"></div>
			<div className="favorites-navbar">
				<div for='cakes' className="btn-add-cart favorites-btn" onClick={(e) => changeTarget(cakes, e)}>Торты</div>
				<div for='candies' className="btn-add-cart favorites-btn" onClick={(e) => changeTarget(candies, e)}>Конфеты</div>
				<div for='ice_cream' className="btn-add-cart favorites-btn" onClick={(e) => changeTarget(ice_cream, e)}>Мороженое</div>
				<div for='dessert' className="btn-add-cart favorites-btn" onClick={(e) => changeTarget(dessert, e)}>Десерты</div>
			</div>
            <form className='item-add__form'>
				<label for='name-input'>Название:</label>		
				<input type="text" id='name-input' placeholder='Введите название' className='item-add__input' onChange ={(e) => setName(e.target.value)}/>
			</form>
            <form className='item-add__form'>
                <label for='price-input'>Цена:</label>		
				<input type="number" id='price-input' placeholder='Введите цену' className='item-add__input price' onChange ={(e) => setPrice(e.target.value)}/>
                <h3>руб.</h3>
			</form>
			<textarea className='add-item_composition' name="composition" id="composition" cols="30" rows="10" placeholder='Введите состав' onChange ={(e) => setComposition(e.target.value)}></textarea>
            <div className="item-cake">
							<div className='add-itme-img-block' onClick={() => inputFileRef.current.click()}>
								{imageUrl ?(
									<img  alt="" width='100%' height='100%'  src={`${process.env.REACT_APP_IMG_URL}${imageUrl}`}/>

								) : (
									<img className='add-itme-img' src={plus} alt="" width='30%'/>
								)}
							</div>
							<div className="item-box">
								<div className="text-box">
									{name === ''?(
                                         <p>Название</p>
                                    ):(
                                        <p>{name}</p>
                                    )}
									<p>{price} ₽</p>
								</div>
							</div>	
						</div>
					<input ref={inputFileRef} hidden type="file" id="upload" onChange={handleChangeFule}/>
					<div className="btn-add-cart add-btn-save" onClick={save}>Сохранить</div>
					</main>

		)}
		</container>
	);
};
