import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, PixelRatio, Keyboard, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { colorTheme, pSBC } from '../constants';


export default function Header(props) {

  const color4 = pSBC(0.52, colorTheme);

  let color3 = pSBC(0.10, colorTheme, 'rgba(194, 00, 255,0.8)');
  color3 = pSBC(-0.34, color3);

  let color1 = pSBC(0.20, colorTheme, 'rgba(00, 00, 00,0.7)');
  color1 = pSBC(-0.05, color1);

  const [keyboardOpened, setKeyboardOpened] = useState(false);

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);
  }, []);

  const _keyboardDidShow = () => {
    setKeyboardOpened(true);
  };

  const _keyboardDidHide = () => {
    setKeyboardOpened(false);
  };

  let keyboardMargin = 0;
  if (Platform.OS === 'android') {
    keyboardOpened ? keyboardMargin = -100 : keyboardMargin = 0;
  }
  return (
    <View style={styles.container}>
      <View style={[styles.circles, { marginTop: keyboardMargin }]}>
        <View style={styles.circleShadow}>
          <View
            style={[styles.circle, styles.fourthCircle, { backgroundColor: color4 }]} />
        </View>
        <View style={styles.circleShadow}>
          <View
            style={[styles.circle, styles.thirdCircle, { backgroundColor: colorTheme }]} />
        </View>
        <View style={styles.circleShadow}>
          <View
            style={[styles.circle, styles.secondCircle, { backgroundColor: color3 }]} />
        </View>
        <LinearGradient
          style={[styles.circle, styles.firstCircle]}
          colors={[color1, color1, color3]} />
      </View>

      <View style={styles.titlesContainer}>
        <Text style={styles.title}>{props.title ? props.title : 'Título'}</Text>
      </View>

    </View >
  )
}

let marginDevice = 0;
let marginLeftDevice = 0;

if (Dimensions.get('window').height <= 760 && Dimensions.get('window').height > 570) {
  marginDevice = -50;
} else if (Dimensions.get('window').height <= 570) {
  marginDevice = -110;
  marginLeftDevice = -40;
}

let titleFontSize = 55;

if (Dimensions.get('window').width * PixelRatio.get() <= 640) {
  titleFontSize = 45;
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },

  circles: {
    zIndex: 2,
    marginTop: -20,
  },

  titlesContainer: {
    zIndex: 3,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },

  title: {
    flexWrap: 'wrap',
    color: "#FFF",
    fontSize: titleFontSize,
    fontFamily: 'Nunito-Bold',
    width: '80%',
    textAlign: 'center',
  },

  circleShadow: {
    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 15,
  },
  circle: {
    zIndex: 2,
    width: 500,
    height: 500,
    borderRadius: 250,
    position: 'absolute',
    marginLeft: marginLeftDevice,
    marginTop: -220 + marginDevice,
  },

  firstCircle: {
  },
  secondCircle: {
    marginTop: -230 + marginDevice,
    marginLeft: marginLeftDevice,
    width: 540,
    height: 540,
    borderRadius: 270,
  },
  thirdCircle: {
    marginTop: -210 + marginDevice,
    marginLeft: -40 + marginLeftDevice,
  },
  fourthCircle: {
    marginTop: -205 + marginDevice,
    marginLeft: -100 + marginLeftDevice,
  }
})