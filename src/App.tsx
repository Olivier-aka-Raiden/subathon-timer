import { KeyProvider } from './components/KeyStore';
import { Timer } from './components/Timer';
import WebsocketProvider from './providers/WebsocketProvider';
import { AuthenticationProvider } from './providers/AuthenticationProvider';
import { SubathonTimerConfigProvider } from './providers/SubathonTimerConfigProvider';
import './App.css';

const AppContent = () => {
  return (
      <div className="App">
        <Timer />
      </div>
  );
};

const App = () => {
  return (
      <KeyProvider>
        <AuthenticationProvider>
          <SubathonTimerConfigProvider>
            <WebsocketProvider>
              <AppContent />
            </WebsocketProvider>
          </SubathonTimerConfigProvider>
        </AuthenticationProvider>
      </KeyProvider>
  );
};

export default App;