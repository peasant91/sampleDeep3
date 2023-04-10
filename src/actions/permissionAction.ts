/**
 * Created by Widiana Putra on 06/04/2023
 * Copyright (c) 2023 - Made with love
 */
import {check, Permission, PERMISSIONS, request} from "react-native-permissions";
import {Platform} from "react-native";

export const checkGalleryPermission = () => {
    let permission: Permission = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
    if (Platform.Version >= 33) {
        permission = PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
    }
    return check(permission)
}

export const requestGalleryPermission = () => {
    let permission: Permission = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
    if (Platform.Version >= 33) {
        permission = PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
    }
    return request(permission)
}
