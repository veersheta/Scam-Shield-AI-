
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
          <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-4 leading-tight tracking-tight">
            Digital Clarity, Absolute Confidence.
          </h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto">
            Welcome to your secure control center. Paste any suspicious message, link, or text for an instant, empathetic analysis designed to empower you against digital threats.
          </p>
        </div>

        <ScamAnalyzer />

        <div className="my-20 md:my-32">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-text-primary mb-12">Your Empowerment Suite</h2>
          <ToolSuite onLoginClick={openLogin} onSignUpClick={openSignUp} />
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal-black text-text-primary font-sans">
      <div className="blob-container">
        <div className="blob blob1"></div>
        <div className="blob blob2"></div>
        <div className="blob blob3"></div>
      </div>
      <Header setView={setView} onLoginClick={openLogin} onSignUpClick={openSignUp} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {renderAppContent()}
      </main>

      <footer className="text-center py-8 border-t border-neutral-light mt-16">
        <p className="text-text-secondary">&copy; 2024 ScamShield AI. Empowering Your Digital Safety.</p>
      </footer>

      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} onSwitchToSignUp={openSignUp} />}
      {isSignUpOpen && <SignUpModal onClose={() => setIsSignUpOpen(false)} onSwitchToLogin={openLogin} />}
    </div>
  );
};

export default App;