import React from 'react';
import { WebView } from 'react-native-webview';

const TermsAndConditions=()=>{
return (
    <WebView source={{ uri: 'https://loadgo.in/privacy-policy.html' }} style={{ flex: 1 }} />
    )
}

export default TermsAndConditions;