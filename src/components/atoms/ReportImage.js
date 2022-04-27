import React, { useEffect } from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { Image } from 'react-native-elements'

import IconView from '../../assets/images/ic_image_view.svg';
import IconAddImage from '../../assets/images/ic_add_image.svg';
import { LatoBold } from './CustomText';
import Colors from '../../constants/Colors';
import translate from '../../locales/translate';
import { getFullLink } from '../../actions/helper';

const ReportImage = ({imageUri, onPress, navigation, title}) => {

    useEffect(() => {
        console.log('imageUri', imageUri)
    }, [])
    

    return <View style={{height: 150, width: '48%', justifyContent: 'space-between', marginTop: 16}}>
        {imageUri ? (
          <TouchableOpacity style={{flex: 1}} onPress={() => navigation.navigate('ImageViewer', {imageUrl: imageUri.includes('/storage/') ? getFullLink(imageUri) : imageUri, title: title})}>
            <Image
              source={{uri: imageUri.includes('/storage/') ? getFullLink(imageUri) : imageUri}}
              style={{
                height: '100%',
                width: '100%',
                resizeMode: 'cover',
              }}
            />
            <View style={{position: 'absolute', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'}}>
            <IconView/>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onPress} style={styles.idContainer}>
            <View style={styles.idContainer}>
              <IconAddImage />
              <LatoBold style={{color: Colors.primary, marginTop: 10}}>
                {translate('add_foto')}
              </LatoBold>
            </View>
          </TouchableOpacity>
        )}
    </View>

}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    flexDirection: 'row',
    height: 150,
  },
  idContainer: {
    backgroundColor: '#F5F6FF',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ReportImage