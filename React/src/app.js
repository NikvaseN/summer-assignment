import React from 'react';
import {Routes, Route } from "react-router-dom";
import ER404 from './pages/404.jsx';
import Catalog from './pages/catalog.jsx';
import Cakes from './pages/cakes.jsx';
import Candies from './pages/candies';
import Cart from './pages/cart.jsx';
import History from './pages/history.jsx';
import Ice_cream from './pages/ice-cream.jsx';
import Desserts from './pages/desserts.jsx';
import Favorites from './pages/favorites.jsx';
import Admin from './pages/admin.jsx';
import List_orders from './pages/list-orders.jsx';
import Item_add from './pages/item_add';
import Item_change from './pages/item_change';

export default function App() {
	return (
		<Routes>
			<Route path='/' element = {<Catalog/>}/>
			<Route path='/cakes' element = {<Cakes/>}/>
			<Route path='/candies' element = {<Candies/>}/>
			<Route path='/cart' element = {<Cart/>}/>
			<Route path='/history/' element = {<History/>}/>
			<Route path='/ice-cream' element = {<Ice_cream/>}/>
			<Route path='/desserts' element = {<Desserts/>}/>
			<Route path='/favorites' element = {<Favorites/>}/>
			<Route path='*' element = {<ER404/>}/>
			<Route path='/admin' element = {<Admin/>}/>
			<Route path='/admin/list' element = {<List_orders/>}/>
			<Route path='/admin/add' element = {<Item_add/>}/>
			<Route path='/admin/change' element = {<Item_change/>}/>
	 	</Routes>
)};
