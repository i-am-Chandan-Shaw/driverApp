import React from 'react';
import { WebView } from 'react-native-webview';

const TermsAndConditions=()=>{
return (
    <WebView source={{ uri: 'https://loadgo.in/#/terms-conditions' }} style={{ flex: 1 }} />
    )
}

export default TermsAndConditions;