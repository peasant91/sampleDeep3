import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Image } from 'react-native-elements'

import IconAdd from '../../assets/images/ic_add_register_vehicle.svg'
import IconDelete from '../../assets/images/ic_delete_register_vehicle.svg'
import IconView from '../../assets/images/ic_image_view.svg';

const RegisterVehiclePicture = ({imageUrl, onDelete, index, navigation, onAdd}) => {

    return <View style={{ width: '48%'}}>
        {imageUrl == ' ' ? 
        <TouchableOpacity onPress={() =>onAdd(index)} style={{flex: 1, backgroundColor: 'white'}}>
                <Image source={require('../../assets/images/ic_add_vehicle_register.png')} style={{aspectRatio: 1.5}}/>
        </TouchableOpacity> :
        <View>
            <TouchableOpacity onPress={() => navigation.navigate('ImageViewer', {imageUrl: imageUrl, title: ''})}>
                <Image source={{uri: imageUrl}} style={{aspectRatio: 1.5}}/>
            <View style={{position: 'absolute', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'}}>
            <IconView/>
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(index)}>
                <IconDelete style={{position: 'absolute', right: 0, bottom: 0}}/>
            </TouchableOpacity>
        </View>
        }
    </View>

}

export default RegisterVehiclePicture