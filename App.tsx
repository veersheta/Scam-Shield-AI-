
import React, { useContext, useState } from 'react';
import Header from './components/Header';
import ScamAnalyzer from './components/ScamAnalyzer';
import { AuthContext } from './contexts/AuthContext';
import AdminDashboard from './components/admin/AdminDashboard';
import LoginModal from './components/auth/LoginModal';
import SignUpModal from './components/auth/SignUpModal';
import ToolSuite from './components/ToolSuite';

const App: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [view, setView] = useState<'main' | 'dashboard'>('main');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const openLogin = () => {
    setIsSignUpOpen(false);
    setIsLoginOpen(true);
  };
  
  const openSignUp = () => {
    setIsLoginOpen(false);
    setIsSignUpOpen(true);
  };

  const renderAppContent = () => {
    if (view === 'dashboard' && user?.role === 'admin') {
      return <AdminDashboard />;
    }

    return (
      <>
        <div className="text-center mb-16 md:mb-20">
          <h1 className="text-4xl md:text-6xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4 leading-tight">
            Your AI Guardian Against Digital Scams
          </h1>
          <p className="text-lg md:text-xl text-light-text-secondary dark:text-dark-text-secondary max-w-3xl mx-auto">
            Paste any suspicious message, link, or text. ScamShield AI analyzes it in real-time to uncover hidden threats and keep you safe.
          </p>
        </div>

        <ScamAnalyzer />

        <div className="my-20 md:my-32">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-light-text-primary dark:text-dark-text-primary mb-12">Explore Your Protection Suite</h2>
          <ToolSuite onLoginClick={openLogin} onSignUpClick={openSignUp} />
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-light-text-primary dark:text-dark-text-primary font-sans transition-colors duration-300">
      <div className="blob-container">
        <div className="blob blob1"></div>
        <div className="blob blob2"></div>
        <div className="blob blob3"></div>
      </div>
      <Header setView={setView} onLoginClick={openLogin} onSignUpClick={openSignUp} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {renderAppContent()}
      </main>

      <footer className="text-center py-8 border-t border-light-border dark:border-dark-border mt-16">
        <p className="text-light-text-secondary dark:text-dark-text-secondary">&copy; 2024 ScamShield AI. Stay vigilant, stay safe.</p>
      </footer>

      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} onSwitchToSignUp={openSignUp} />}
      {isSignUpOpen && <SignUpModal onClose={() => setIsSignUpOpen(false)} onSwitchToLogin={openLogin} />}
    </div>
  );
};

export default App;