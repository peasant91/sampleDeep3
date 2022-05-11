import React, { useEffect, useRef, useState } from 'react'
import { FlatList, SafeAreaView } from 'react-native'
import ListNotification from '../components/atoms/list/ListNotification'
import NavBar from '../components/atoms/NavBar'
import translate from '../locales/translate'
import { getNotification } from '../services/notification'




const NotificationScreen = ({ navigation, route }) => {

    const page = useRef(1)

    const [canLoadMore, setcanLoadMore] = useState(true)
    const [data, setdata] = useState([])


    const getNotificationAPI = () => {
        if (canLoadMore) {
            getNotification({
                page: page.current
            }).then(response => {
                if (response.length <= 0) {
                    setcanLoadMore(false)
                }

                if (page.current == 1) {
                    setdata(response)
                } else {
                    setdata([...data, ...response])
                }

                page.current += 1
            })
        }
    }

    useEffect(() => {
        getNotificationAPI()
    }, [])



    return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <NavBar title={translate('notification')} shadowEnabled navigation={navigation} />
        <FlatList
            data={data}
            keyExtractor={item => item.id}
            onEndReached={getNotificationAPI}
            onEndReachedThreshold={0.5}
            renderItem={({ item, index }) => {
                return <ListNotification data={item} />
            }}
        />
    </SafeAreaView>

}

export default NotificationScreen