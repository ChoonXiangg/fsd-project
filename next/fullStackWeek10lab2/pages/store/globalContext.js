// Lets do all database stuff here and just share this global context with the rest of the App
// - so no database code anywhere else in our App
// - every CRUD function the App needs to do is in here, in one place
// - makes debugging etc so much easier
// - all external connections still have to go through /api routes 

import { createContext, useState, useEffect } from 'react'

const GlobalContext = createContext()

export function GlobalContextProvider(props) {
    const [globals, setGlobals] = useState({ aString: 'init val', count: 0, hideHamMenu: true, properties: [], dataLoaded: false, user: null })

    useEffect(() => {
        getAllProperties()
        checkAuthToken() // Check for existing JWT token on app load
    }, []);

    async function getAllProperties() {
        const response = await fetch('/api/get-properties', {
            method: 'POST',
            body: JSON.stringify({ properties: 'all' }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let data = await response.json();
        setGlobals((previousGlobals) => { const newGlobals = JSON.parse(JSON.stringify(previousGlobals)); newGlobals.properties = data.properties; newGlobals.dataLoaded = true; return newGlobals })
    }

    async function checkAuthToken() {
        // Check if JWT token exists in localStorage
        const token = localStorage.getItem('authToken');
        console.log('Checking auth token on app load:', token ? 'Token found' : 'No token');

        if (!token) {
            return; // No token found, user stays logged out
        }

        try {
            // Verify token with backend
            console.log('Verifying token with backend...');
            const response = await fetch('/api/auth/verify-token', {
                method: 'POST',
                body: JSON.stringify({ token }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Token verification response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Token valid! Restoring user:', data.user);
                // Token is valid, restore user to context
                setGlobals((previousGlobals) => {
                    const newGlobals = JSON.parse(JSON.stringify(previousGlobals));
                    newGlobals.user = data.user;
                    return newGlobals;
                });
            } else {
                const errorData = await response.json();
                console.log('Token invalid:', errorData);
                // Token is invalid or expired, remove it
                localStorage.removeItem('authToken');
            }
        } catch (error) {
            console.error('Error verifying token:', error);
            localStorage.removeItem('authToken');
        }
    }

    async function editGlobalData(command) { // {cmd: someCommand, newVal: 'new text'}
        if (command.cmd == 'hideHamMenu') { // {cmd: 'hideHamMenu', newVal: false} 
            //  WRONG (globals object reference doesn't change) and react only looks at its 'value' aka the reference, so nothing re-renders:
            //    setGlobals((previousGlobals) => { let newGlobals = previousGlobals; newGlobals.hideHamMenu = command.newVal; return newGlobals })
            // Correct, we create a whole new object and this forces a re-render:
            setGlobals((previousGlobals) => {
                const newGlobals = JSON.parse(JSON.stringify(previousGlobals));
                newGlobals.hideHamMenu = command.newVal; return newGlobals
            })
        }
        if (command.cmd == 'addProperty') {
            const response = await fetch('/api/new-property', {
                method: 'POST',
                body: JSON.stringify(command.newVal),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json(); // Should check here that it worked OK
            setGlobals((previousGlobals) => {
                const newGlobals = JSON.parse(JSON.stringify(previousGlobals))
                newGlobals.properties.push(data); return newGlobals
            })
        }
        if (command.cmd == 'setUser') { // {cmd: 'setUser', user: {username, email, etc}, token: 'jwt-token'}
            // Store JWT token in localStorage if provided
            if (command.token) {
                console.log('Storing JWT token in localStorage');
                localStorage.setItem('authToken', command.token);
            } else {
                console.log('No token provided - keeping existing token (profile update)');
                // No token means this is a profile update, keep existing token
            }

            setGlobals((previousGlobals) => {
                const newGlobals = JSON.parse(JSON.stringify(previousGlobals));
                newGlobals.user = command.user;
                return newGlobals;
            })
        }
        if (command.cmd == 'logout') {
            // Remove JWT token from localStorage
            localStorage.removeItem('authToken');

            setGlobals((previousGlobals) => {
                const newGlobals = JSON.parse(JSON.stringify(previousGlobals));
                newGlobals.user = null;
                return newGlobals;
            })
        }
    }

    const context = {
        updateGlobals: editGlobalData,
        theGlobalObject: globals
    }

    return <GlobalContext.Provider value={context}>
        {props.children}
    </GlobalContext.Provider>
}


export default GlobalContext
