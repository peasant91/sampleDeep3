import React from 'react';
import {TouchableOpacity, View} from 'react-native';

import IconInfo from '../../assets/images/ic_home_info.svg';
import {LatoMedium, LatoRegular} from './CustomText';
import CustomButton from "./CustomButton";
import {Button} from "react-native-elements";
import Colors from "../../constants/Colors";

const InfoMenu = ({text, containerStyle, actionButton, actionButtonTitle, actionButtonAction}) => {
    return (
        <View
            style={[
                {
                    backgroundColor: '#F5F6FF',
                    borderRadius: 5,
                    flexDirection: 'row',
                    flex: 1,
                },
                containerStyle,
            ]}>
            <IconInfo/>
            <View style={{
                flex: 1,
                flexDirection: 'column',
            }}>
                <LatoRegular
                    style={{
                        paddingTop: 10,
                        paddingBottom: 10,
                        marginHorizontal: 8,
                        width: '92%',
                        fontSize: 14,
                    }}>
                    {text}
                </LatoRegular>

                {
                    actionButton
                        ? <View style={{
                            alignSelf: "flex-start",
                            marginBottom: 10,
                        }}>
                            <TouchableOpacity onPress={actionButtonAction}>
                                <LatoRegular
                                    style={{
                                        color: Colors.secondary,
                                        fontSize: 14,
                                        marginHorizontal: 8,
                                        borderBottomWidth: 1,
                                        borderBottomColor: Colors.secondary,
                                    }}
                                >
                                    {actionButtonTitle}
                                </LatoRegular>
                            </TouchableOpacity>
                        </View>
                        : <></>
                }
            </View>
        </View>
    );
};

export default InfoMenu;
