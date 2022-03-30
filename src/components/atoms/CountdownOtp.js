import React, { useState, useEffect} from 'react'
import { TouchableOpacity, View } from 'react-native'
import Colors from '../../constants/Colors'
import translate from '../../locales/translate'
import { LatoBold } from './CustomText'


const CountdownOtp = ({onPress}) => {

  const [timerCount, setTimer] = useState(30)

  const onResend = () => {
      if (timerCount == 0) {
        setTimer(30)
        onPress()
      }
  }

  useEffect(() => {
      if (timerCount > 0) {

    let interval = setInterval(() => {
      setTimer(lastTimerCount => {
          lastTimerCount <= 1 && clearInterval(interval)
          return lastTimerCount - 1
      })
    }, 1000) //each count lasts for a second
    return () => clearInterval(interval)
      }
  }, [timerCount]);

  return <TouchableOpacity onPress={onResend}>
      <View style={{ padding: 16, backgroundColor: Colors.divider }}>
        <LatoBold style={{ color: Colors.primary }} containerStyle={{ alignSelf: 'center' }}>{timerCount == 0 ? translate('resend_otp_code_id', { string: '' }) : translate('resend_otp_code_id', { string: `(${timerCount})` })}</LatoBold>
      </View>
    </TouchableOpacity>

}

export default CountdownOtp