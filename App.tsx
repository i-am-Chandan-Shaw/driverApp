/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { AppProvider } from './src/core/helper/AppContext';
import { ThemeProvider } from './src/constants/ThemeContext';
import Navigation from './src/navigation';




function App() {
    return (
        <ThemeProvider>
            <AppProvider>
                <Navigation />
            </AppProvider>
        </ThemeProvider>
    );
}


export default App;
