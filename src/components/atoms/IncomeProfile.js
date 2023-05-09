import moment from 'moment'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Shadow } from 'react-native-shadow-2'
import { toCurrency } from '../../actions/helper'
import Colors from '../../constants/Colors'
import translate from '../../locales/translate'
import { LatoBold, LatoRegular } from './CustomText'


const IncomeProfile = ({data, onPress}) => {
    return <Shadow viewStyle={{width: '100%', marginBottom: 10}} radius={8} distance={2} offset={[0,1]} startColor={Colors.divider}  >
            <View style={{borderRadius: 8, overflow: 'hidden'}}>
                <View style={{backgroundColor: '#F5F6FF', padding: 10, justifyContent: 'center', alignItems: 'center'}}>
                    <LatoBold style={{fontSize: 18}}>{toCurrency(data.total)}</LatoBold>
                    <LatoRegular containerStyle={{marginTop: 10}}>{moment(Date()).format('yyyy')}</LatoRegular>
                </View>
                <View style={{backgroundColor: 'white'}}>
                {
                    data.transaction.map((value, index) => {
                        if (index < 2) {
                        return <View style={{padding: 5}}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <LatoRegular>{moment(value.date).format('DD MMMM yyyy')}</LatoRegular>
                                <LatoRegular style={{color: Colors.primarySecondary}}>{'+' + toCurrency(value.amount)}</LatoRegular>
                            </View>
                            <View style={{height: 1, backgroundColor: Colors.divider, marginTop: 5}}/>
                        </View>
                        }
                    })
                }
                <TouchableOpacity onPress={onPress}>
                    <LatoRegular style={{textDecorationLine: 'underline', color: Colors.primarySecondary}} containerStyle={{alignSelf: 'center', paddingBottom: 10}}>{translate('see_detail')}</LatoRegular>
                </TouchableOpacity>
                </View>
            </View>
        </Shadow>
}

export default IncomeProfile