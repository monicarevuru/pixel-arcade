import { useState } from 'react';
import MainMenu from './components/MainMenu';
import ZenKeys from './games/ZenKeys';
import AsteroidDodger from './games/AsteroidDodger';

function App() {
  const [screen, setScreen] = useState('menu');

  return (
    <div className="app-container">
      {screen === 'menu' && (
        <MainMenu onNavigate={setScreen} />
      )}
      {screen === 'zenkeys' && (
        <ZenKeys onBack={() => setScreen('menu')} />
      )}
      {screen === 'asteroids' && (
        <AsteroidDodger onBack={() => setScreen('menu')} />
      )}
    </div>
  );
}

export default App;
