import { useState, useEffect, useContext } from 'react';
import classes from './StartupPopup.module.css';
import GlobalContext from '../../pages/store/globalContext';

function StartupPopup() {
  const globalCtx = useContext(GlobalContext);
  const [isVisible, setIsVisible] = useState(false);
  const [view, setView] = useState('welcome'); // 'welcome', 'login', 'signup'
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    verifiedAgent: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('hasSeenStartupPopup');

    // Show popup if user hasn't seen it AND user is not logged in
    if (!hasSeenPopup && !globalCtx.theGlobalObject.user) {
      setIsVisible(true);
    }
  }, [globalCtx.theGlobalObject.user]); // Re-run when user state changes

  const closePopup = () => {
    sessionStorage.setItem('hasSeenStartupPopup', 'true');
    setIsVisible(false);
  };

  const handleLoginClick = () => {
    setView('login');
    setError('');
  };

  const handleSignupClick = () => {
    setView('signup');
    setError('');
  };

  const handleBackToWelcome = () => {
    setView('welcome');
    setError('');
    setLoginData({ email: '', password: '' });
    setSignupData({ username: '', email: '', password: '', phoneNumber: '', verifiedAgent: false });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (response.ok) {
        globalCtx.updateGlobals({ cmd: 'setUser', user: data.user, token: data.token });
        sessionStorage.setItem('hasSeenStartupPopup', 'true');
        setIsVisible(false);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData)
      });

      const data = await response.json();

      if (response.ok) {
        globalCtx.updateGlobals({ cmd: 'setUser', user: data.user, token: data.token });
        sessionStorage.setItem('hasSeenStartupPopup', 'true');
        setIsVisible(false);
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className={classes.overlay}>
      <div className={classes.popup}>
        {view === 'welcome' && (
          <>
            <h2>Welcome to Real Estate App!</h2>
            <p>Login or signup to continue!</p>
            <button className={classes.loginButton} onClick={handleLoginClick}>
              Login
            </button>
            <button className={classes.signupButton} onClick={handleSignupClick}>
              Signup
            </button>
          </>
        )}

        {view === 'login' && (
          <>
            <button className={classes.backButton} onClick={handleBackToWelcome}>
              &larr; Back
            </button>
            <h2>Login</h2>
            {error && <p className={classes.error}>{error}</p>}
            <form onSubmit={handleLoginSubmit}>
              <div className={classes.formGroup}>
                <label htmlFor="loginEmail">Email</label>
                <input
                  type="email"
                  id="loginEmail"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>
              <div className={classes.formGroup}>
                <label htmlFor="loginPassword">Password</label>
                <input
                  type="password"
                  id="loginPassword"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className={classes.submitButton} disabled={loading}>
                {loading ? 'Loading...' : 'Login'}
              </button>
            </form>
          </>
        )}

        {view === 'signup' && (
          <>
            <button className={classes.backButton} onClick={handleBackToWelcome}>
              &larr; Back
            </button>
            <h2>Sign Up</h2>
            {error && <p className={classes.error}>{error}</p>}
            <form onSubmit={handleSignupSubmit}>
              <div className={classes.formGroup}>
                <label htmlFor="signupUsername">Username</label>
                <input
                  type="text"
                  id="signupUsername"
                  value={signupData.username}
                  onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                  required
                />
              </div>
              <div className={classes.formGroup}>
                <label htmlFor="signupEmail">Email</label>
                <input
                  type="email"
                  id="signupEmail"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  required
                />
              </div>
              <div className={classes.formGroup}>
                <label htmlFor="signupPassword">Password</label>
                <input
                  type="password"
                  id="signupPassword"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  required
                />
              </div>
              <div className={classes.formGroup}>
                <label htmlFor="signupPhone">Phone Number</label>
                <input
                  type="tel"
                  id="signupPhone"
                  value={signupData.phoneNumber}
                  onChange={(e) => setSignupData({ ...signupData, phoneNumber: e.target.value })}
                  required
                />
              </div>
              <div className={classes.checkboxGroup}>
                <input
                  type="checkbox"
                  id="verifiedAgent"
                  checked={signupData.verifiedAgent}
                  onChange={(e) => setSignupData({ ...signupData, verifiedAgent: e.target.checked })}
                />
                <label htmlFor="verifiedAgent">Verified Agent</label>
              </div>
              <button type="submit" className={classes.submitButton} disabled={loading}>
                {loading ? 'Loading...' : 'Sign Up'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default StartupPopup;
