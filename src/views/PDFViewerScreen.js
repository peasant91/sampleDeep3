import React from "react";
import NavBar from "../components/atoms/NavBar";
import translate from "../locales/translate";
import {SafeAreaView, StatusBar, View} from "react-native";
import WebView from "react-native-webview";

export default function PDFViewerScreen(
    {navigation, route}
){
    const title = route?.params?.title;
    const source = route?.params?.source ?? "https://dev-otomedia.timedoor-host.web.id/storage/report/weekly-report.pdf";
    return <View style={{
        flex:1
        }}>
        <NavBar
            title={title ?? ""}
            navigation={navigation}
            />
        <View style={{
            overflow: "hidden",
            flex:1,
        }}>
            <WebView
            source={{uri: `https://docs.google.com/gview?embedded=true&url=${source}`}}
            />
        </View>
    </View>

}
