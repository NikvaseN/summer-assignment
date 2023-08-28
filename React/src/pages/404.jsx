import Header from '../components/header.jsx';
import '../components/normalize.css'
import Er404 from '../img/icons/404.jpg'
// import TranslationApp from '../components/translate.jsx';
export default function ER404() {
	return (
		<container>
			{/* <Header/> */}
			<img className='img-404' src={Er404} alt="" style={{marginTop:-25,marginBottom: -25}}/>
		</container>
	);
  };
