import ReactDOM from 'react-dom/client';
import App from './App';

import "@fortawesome/fontawesome-free/css/all.min.css";
import "../assets/fonts/icomoon/style.css";
import "../common.css"
import "@fontsource/roboto"
import 'material-react-toastify/dist/ReactToastify.min.css';

const root = ReactDOM.createRoot(
    document.querySelector('body') as HTMLElement
);

root.render(
    <App/>
);
