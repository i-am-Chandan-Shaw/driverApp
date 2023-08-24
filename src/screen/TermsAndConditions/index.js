import React from 'react';
import { WebView } from 'react-native-webview';

const TermsAndConditions=()=>{
return (
    <WebView source={{ uri: 'https://reactnative.dev/' }} style={{ flex: 1 }} />
    )
}

export default TermsAndConditions;