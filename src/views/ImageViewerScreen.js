import React from 'react'
import { SafeAreaView, View } from 'react-native'
// import PhotoView from 'react-native-photo-view-ex'
import NavBar from '../components/atoms/NavBar'

const ImageViewerScreen = ({ navigation, route }) => {
    return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <NavBar title={route.params.title} navigation={navigation} shadowEnabled={true} />
        {/* <PhotoView
            source={{ uri: route.params.imageUrl }}
            minimumZoomScale={1}
            maximumZoomScale={3}
            androidScaleType="center"
            onLoad={() => console.log("Image loaded!")}
            style={{ width: '100%', height: '100%', flex: 1 }} /> */}

    </SafeAreaView>
}

export default ImageViewerScreen