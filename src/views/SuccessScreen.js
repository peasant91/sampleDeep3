import React,{useEffect} from 'react'
import { SafeAreaView, Image, View, StatusBar, TouchableOpacity,BackHandler } from 'react-native';
import Colors from '../constants/Colors';
import { Subtitle1, Subtitle2 } from '../components/atoms/CustomText';
import CustomButton from '../components/atoms/CustomButton';
import CloseIcon from '../assets/images/ic_close_white.svg';

const SuccessScreen = ({ navigation, route }) => {

    useEffect(()=>{
        const backAction = () => {
            console.log("back button");
            route.params.onPress()
            return true
        };
        BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', backAction);
        }
    },[])

    return (
        <>
            <SafeAreaView style={{ flex: 0, backgroundColor: Colors.primary }} />
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                <StatusBar backgroundColor={Colors.primary} barStyle='light-content' />
                <View style={{ flex: 1 }}>
                    <Image
                        source={route.params.image}
                        resizeMode='contain'
                        style={{ width: '100%', height: undefined, aspectRatio: 0.96 }} />
                    <View style={{ position: 'absolute', padding: 16}}>
                        <TouchableOpacity onPress={route.params.onPress}>
                            <CloseIcon />
                        </TouchableOpacity>
                    </View>
                    <View style={{ margin: 16, justifyContent: 'center' }}>
                        <Subtitle1 style={{ textAlign: 'center', marginTop: 24 }}>{route.params.title}</Subtitle1>
                        <Subtitle2 style={{ textAlign: 'center', marginTop: 10, color: Colors.secondText }}>{route.params.desc}</Subtitle2>
                    </View>
                </View>
                <CustomButton
                    types='primary'
                    containerStyle={{ margin: 16 }}
                    title={route.params.buttonTitle}
                    onPress={route.params.onPress}
                />
            </SafeAreaView>
        </>
    )
}

export default SuccessScreen