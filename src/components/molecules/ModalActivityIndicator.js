import React from 'react'
import { ActivityIndicator, Modal, Text, View } from "react-native";


const ModalActivityIndicator = props => {
    const {
      show = false,
      color = "black",
      backgroundColor = "transparent",
      dimLights = 0.6,
    } = props;
    return (
      <Modal transparent={true} animationType="none" visible={show}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: `rgba(0,0,0,${dimLights})`
          }}
        >
          <View
            style={{
              padding: 13,
              backgroundColor: `${backgroundColor}`,
              borderRadius: 13
            }}
          >
            <ActivityIndicator animating={show} color={color} size="large" />
          </View>
        </View>
      </Modal>
    );
  };

  export default ModalActivityIndicator