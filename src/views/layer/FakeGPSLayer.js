import React, {useEffect, useRef, useState} from 'react'
import {AppState, BackHandler} from "react-native";
import {checkIsFakeGPS, stopGeolocationService} from "../../actions/helper";
import Geolocation from 'react-native-geolocation-service';
import {useCommonAction} from "../../actions/commonActions";

export default function FakeGPSLayer(props){
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    const {showErrorDialog} = useCommonAction()

    useEffect(() => {
        checkFakeGPS()
    },[])

    useEffect(() => {
        const subscription = AppState.addEventListener('change', async nextAppState => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                console.log("CHECK FAKE GPS")
                checkFakeGPS()
            }
            appState.current = nextAppState;
            setAppStateVisible(appState.current);
            console.log('AppState', appState.current);
        });

        return () => {
            subscription.remove();
        };
    }, []);

    const checkFakeGPS = () => {
        checkIsFakeGPS((isFake) => {
            console.log("isFake", isFake)
            if(isFake){
                showErrorDialog({
                    error: {
                        title: "Terdeteksi menggunakan Fake GPS",
                        message: "Perangkat Anda terdeteksi menggunakan aplikasi pihak ketiga. Matikan aplikasi tersebut untuk melanjutkan menggunakan aplikasi Otomedia.",
                    },
                    positiveTitle: "BAIK, SAYA MENGERTI",
                    positiveAction: () => {
                        stopGeolocationService();
                        BackHandler.exitApp()
                    },
                    imageSrc: require('../../assets/illusts/illust_fake_gps/illust_fake_gps.png')
                })
            }
        })
    }

    return <>
        {props?.children}
    </>
}
