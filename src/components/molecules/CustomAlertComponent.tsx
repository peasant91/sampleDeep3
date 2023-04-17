/**
 * Created by Widiana Putra on 06/04/2023
 * Copyright (c) 2023 - Made with love
 */
import React from "react";
import {Image, ImageSourcePropType, StyleSheet, Text, View} from "react-native";
import Colors from "../../constants/Colors";
import CustomButton from "../atoms/CustomButton";
import translate from "../../locales/translate";
import {LinearProgress} from "react-native-elements";

interface Props {
    imageSrc?: ImageSourcePropType;
    title?: string;
    description?: string;
    positiveTitle?: string;
    negativeTitle?: string;
    onPositivePress?: () => void;
    onNegativePress?: () => void;
    isDoubleButton?: boolean;
    loading?: boolean;

}

const CustomAlertComponent = ({...props}: Props) => {
    return (
        <View {...props} style={styles.mainContainer}>
            {
                props?.imageSrc
                    ? <View style={{
                        marginBottom: 4
                    }}>
                        <Image source={props.imageSrc}/>
                    </View>
                    : <></>
            }
            {
                props?.title
                    ? <Text
                        style={{
                            fontFamily: 'Lato-Bold',
                            marginTop: 10,
                            fontSize: 18,
                            marginBottom: props.description ? 8 : 16,
                            alignSelf: 'center',
                            textAlign: 'center',
                            minWidth: '80%',
                            color: Colors.primary
                        }}>
                        {props.title}
                    </Text>
                    : <></>
            }
            {
                props.description
                    ? <Text
                        style={{
                            fontFamily: 'Lato-Regular',
                            marginTop: 0,
                            fontSize: 14,
                            marginBottom: 16,
                            alignSelf: 'center',
                            textAlign: 'center',
                            minWidth: '80%',
                            color: Colors.subGray
                        }}>
                        {props.description}
                    </Text>
                    : null
            }

            {
                props.loading
                    ? <>
                    <LinearProgress color={Colors.primary}/>
                    </>
                    : <>
                        {props.isDoubleButton ? (
                            <View
                                style={{
                                    flexDirection: 'column',
                                    display: 'flex',
                                    marginTop: 10,
                                    marginBottom: 10,
                                }}>
                                <View style={{flex: 1}}>
                                    <CustomButton
                                        types="secondary"
                                        onPress={props.onNegativePress}
                                        style={{height: 40, marginHorizontal: 2}}
                                        title={
                                            props.negativeTitle ? props.negativeTitle : translate('cancel')
                                        }
                                    />
                                </View>
                                <View style={{flex: 1, marginLeft: 10}}>
                                    <CustomButton
                                        types="primary"
                                        onPress={props.onPositivePress}
                                        style={{height: 40, marginHorizontal: 2}}
                                        title={
                                            props.positiveTitle ? props.positiveTitle : translate('retry')
                                        }
                                    />
                                </View>
                            </View>
                        ) : (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    display: 'flex',
                                    marginTop: 10,
                                    marginBottom: 10,
                                }}>
                                <View style={{flex: 1}}>
                                    <CustomButton
                                        types="primary"
                                        onPress={props.onPositivePress}
                                        title={
                                            props.positiveTitle ? props.positiveTitle : translate('ok')
                                        }
                                    />
                                </View>
                            </View>
                        )}
                    </>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        padding: 16,
        marginVertical: 20,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        minWidth: '80%',
        maxWidth: '80%',
        marginHorizontal: 16,
        backgroundColor: 'white',
        borderRadius: 12,
    },
});

export default CustomAlertComponent;
