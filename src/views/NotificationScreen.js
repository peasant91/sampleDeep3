import React from 'react'
import { FlatList, SafeAreaView } from 'react-native'
import ListNotification from '../components/atoms/list/ListNotification'
import NavBar from '../components/atoms/NavBar'
import translate from '../locales/translate'

const data = [
    {
        id: 1,
        imageUrl: 'https://picsum.photos/300/300',
        title: 'lorem ipsum',
        desc: 'lorem ipsum dolor sit amet',
        date: '20 Dec 2022',
        isRead: false
    },
    {
        id: 2,
        imageUrl: 'https://picsum.photos/300/300',
        title: 'lorem ipsum',
        desc: 'lorem ipsum dolor sit amet \n lorem ipsum',
        date: '20 Dec 2022',
        isRead: true
    },
    {
        id: 3,
        imageUrl: 'https://picsum.photos/300/300',
        title: 'lorem ipsum',
        desc: 'lorem ipsum dolor sit amet',
        date: '20 Dec 2022',
        isRead: false
    },
]


const NotificationScreen = ({navigation, route}) => {

    return <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <NavBar title={translate('notification')} shadowEnabled navigation={navigation}/>
        <FlatList
            data={data}
            keyExtractor={item => item.id}
            renderItem={({item, index}) => {
                return <ListNotification data={item}/>
            }}
        />
    </SafeAreaView>

}

export default NotificationScreen