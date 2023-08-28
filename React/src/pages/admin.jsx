import Header from '../components/header.jsx';
import '../components/normalize.css'
import '../components/admin.css'
import plus from '../img/icons/plus.png'
import change from '../img/icons/change.png'
import { Link } from 'react-router-dom';
import React from 'react';
import axios from '../axios.js';
export default function Admin() {
    const [user, setUser] = React.useState('')
	React.useEffect(() =>{
		axios.get('/auth/me').then(res =>{
			setUser(res.data)
		}).catch(setUser(false))
	}, [])
	
    return (
		<container>
			<div className="empty-header"></div>
           
            {(user.role === 'moderator' || user.role === 'admin') &&(
                <>
                 <h2>Выберите действие</h2>
                 <main className="action">
                     <Link to='add'>
                         <div className="action__item add">
                             <div className="ground"></div>
                             <img src={plus} alt="" width='30%'/>
                         </div>
                     </Link>

					 <Link to='change'>
						<div className="action__item remove">
							<div className="ground"></div>
							<img src={change} alt="" width='30%'/>
						</div>
					 </Link>
                 </main>
                 </>
			)}
		</container>
	);
  };
