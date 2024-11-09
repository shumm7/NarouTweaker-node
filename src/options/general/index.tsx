
import ReactDOM from 'react-dom/client';

import App from './app/App';

import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../assets/fonts/icomoon/style.css";
import "../../common.css"

const root = ReactDOM.createRoot(
    document.querySelector('body') as HTMLElement
);

root.render(
    <App/>
);
