import './App.css';
import { Photogrid } from './Photogrid/Photogrid';
import { Photo } from './Photo/Photo';
import { Provider } from 'react-redux';
import { store } from './store';
function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <p className="gallerytext">Gallery</p>
        <Photogrid>
          <Photo></Photo>
        </Photogrid>
      </div>
    </Provider>
  );
}

export default App;
