import './App.css';
import { Photogrid } from './Photogrid/Photogrid';
import { Photo } from './Photo/Photo';
function App() {
  return (
    <div className="App">
      <p className="gallerytext">Gallery</p>
      <Photogrid>
        <Photo></Photo>
      </Photogrid>
    </div>
  );
}

export default App;
