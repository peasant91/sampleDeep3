import React, {ComponentProps} from "react";
import BottomSheetWrapper from "./BottomSheetWrapper";
import {TouchableOpacity, View} from "react-native";
import {LatoBold, LatoRegular} from "../atoms/CustomText";
import {Divider, Icon} from "react-native-elements";
import Colors from "../../constants/Colors";


export default function ReportImageEditBS(
    {onOpenPreview, onRetakeImage, ...props}
) {
    return <BottomSheetWrapper {...props}>
        <View style={{
            padding: 16,
            marginTop: 8,
        }}>
            <LatoBold style={{
                fontSize: 16,
            }}>Unggah Foto</LatoBold>
            <TouchableOpacity
                onPress={onRetakeImage}
                style={{
                width: "100%",
                flexDirection: "row",
                marginTop:8,
                paddingVertical: 16
            }}>
                <Icon name={"camera"} type={"ionicon"} size={22} color={Colors.greyDark}/>
                <LatoRegular containerStyle={{marginLeft: 12}}>Ambil Ulang dari Kamera</LatoRegular>
            </TouchableOpacity>
            <Divider/>
            <TouchableOpacity
                onPress={onOpenPreview}
                style={{
                width: "100%",
                flexDirection: "row",
                paddingVertical: 16
            }}>
                <Icon name={"eye"} type={"ionicon"} size={22} color={Colors.greyDark}/>
                <LatoRegular containerStyle={{marginLeft:12}}>Lihat Foto</LatoRegular>
            </TouchableOpacity>

        </View>
    </BottomSheetWrapper>
}
