import { VideoConverter } from "./components/videoConverter";


function App() {
  return (
    <div className="App">
      <div className="header">
        <div className="leftHeader">
          <p>home</p>
        </div>
        <div className="rightHeader">
          <p>about</p>
        </div>
      </div>
      <div className="main">
        <h1>CREATOR'S TOOLKIT</h1>
        <p>Everything you could ever need</p>
        <div className="toolbox">
          <VideoConverter/>
          <div className="tool">
            <h3>Screen Recorder</h3>
          </div>
          <div className="tool">
            <h3>Music Downloader</h3>
          </div>
          <div className="tool">
            <h3>Phone Video Transferer</h3>
          </div>
          <div className="tool">
            <h3></h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
