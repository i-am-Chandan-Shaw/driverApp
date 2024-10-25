// WebViewBanner.js
import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import ANTIcon from 'react-native-vector-icons/AntDesign';

const WebViewBanner = ({ visible, onClose, contentUrl }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
    >

      <View style={styles.modalBackground}>
        
        <View style={styles.modalContainer}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <ANTIcon name="close" size={13} color={'#000'} />
        </TouchableOpacity>
          <WebView
            source={{ uri: contentUrl }}
            style={styles.webview}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    zIndex: 10000,
    backgroundColor:'#CCC',
    borderRadius:20,
    padding:5
  },
  modalContainer: {
    width: 300,
    height: 500,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  webview: {
    flex: 1,
  },
});

export default WebViewBanner;
