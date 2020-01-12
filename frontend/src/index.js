import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

// import './resources/css/styles.min.css'
import './resources/css/styles.css'
import './resources/vendor/font-awesome/css/fontawesome.min.css'
import './resources/vendor/font-awesome/css/solid.min.css'
import './resources/vendor/font-awesome/css/brands.min.css'

import React from 'react'
import { render } from 'react-dom'
import Root from './site/Root'
import registerServiceWorker from './registerServiceWorker';

render(<Root />, document.getElementById('root'));
registerServiceWorker();