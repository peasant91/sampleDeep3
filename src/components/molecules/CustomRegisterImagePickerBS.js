import React from "react";
import BottomSheetWrapper from "./BottomSheetWrapper";
import {TouchableOpacity, View} from "react-native";
import {LatoBold, LatoRegular} from "../atoms/CustomText";
import translate from "../../locales/translate";
import IconGallery from "../../assets/images/ic_gallery_picker.svg";
import Colors from "../../constants/Colors";
import IconCamera from "../../assets/images/ic_camera_picker.svg";
import IconDelete from "../../assets/images/ic_trash_black.svg";

export default function CustomRegisterImagePickerBS(
    {onGallery, onCamera,isImageEmpty, onDelete,...props}
){
    return <BottomSheetWrapper {...props}>
        <View style={{paddingHorizontal: 16, paddingVertical: 24}}>
            <LatoBold containerStyle={{
                marginBottom:8
            }}>{translate('pick_photo')}</LatoBold>
            <TouchableOpacity
                onPress={onGallery}
                style={{marginVertical: 10}}>
                <LatoRegular Icon={IconGallery}>
                    {translate('pick_gallery')}
                </LatoRegular>
            </TouchableOpacity>
            <View
                style={{
                    height: 1,
                    backgroundColor: Colors.divider,
                    marginBottom: 10,
                    marginLeft: 28,
                }}
            />
            <TouchableOpacity onPress={onCamera}>
                <LatoRegular Icon={IconCamera}>
                    {translate('pick_camera')}
                </LatoRegular>
            </TouchableOpacity>

            {!isImageEmpty && (
                <View>
                    <View
                        style={{
                            height: 1,
                            backgroundColor: Colors.divider,
                            marginTop: 10,
                            marginBottom: 10,
                            marginLeft: 28,
                        }}
                    />
                    <TouchableOpacity onPress={onDelete}>
                        <LatoRegular Icon={IconDelete}>
                            {translate('pick_delete')}
                        </LatoRegular>
                    </TouchableOpacity>
                </View>
            )}
        </View>

    </BottomSheetWrapper>
}
