/**
 * Created by Widiana Putra on 13/02/2023
 * Copyright (c) 2023 - Made with love
 */

import React, {ReactNode, useEffect, useRef} from "react";
import {SafeAreaView, View} from "react-native";
import {Modalize} from "../../modules/Modalize";
import {Portal} from "react-native-portalize";

interface Props {
    dismissible?: boolean;
    onClose: () => void;
    open: boolean;
    children?: ReactNode;
    fullScreen?: boolean;
}

const BottomSheetWrapper = ({open, onClose, dismissible, fullScreen, ...props}: Props) => {
    const ref = useRef<Modalize>(null);
    useEffect(() => {
        if (open) {
            ref?.current?.open();
        } else {
            ref?.current?.close();
        }
    }, [open]);

    return <Modalize
        ref={ref}
        handlePosition={"inside"}
        closeOnOverlayTap={dismissible}
        withHandle={dismissible}
        adjustToContentHeight={true}
        onBackButtonPress={dismissible == false
            ? () => {
                return true;
            }
            : undefined}
        tapGestureEnabled={dismissible}
        panGestureEnabled={dismissible}
        modalStyle={{
            borderTopRightRadius: 16,
            borderTopLeftRadius: 16,
        }}
        onClose={onClose}
        customRenderer={
            <View
                style={
                    fullScreen ? {
                            height: "100%",
                        }
                        : {}
                }
            >

                <SafeAreaView style={
                    fullScreen ? {flex: 1} : {}
                }>
                    <View style={fullScreen ? {flex: 1} : {}}>
                        {
                            props.children
                        }
                    </View>
                </SafeAreaView>
            </View>
        }
    />
};

export default BottomSheetWrapper;
