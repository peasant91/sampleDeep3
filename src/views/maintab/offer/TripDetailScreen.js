import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { FlatList, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { showDialog } from '../../../actions/commonActions'
import BlueHeader from '../../../components/atoms/BlueHeader'
import { LatoRegular } from '../../../components/atoms/CustomText'
import Divider from '../../../components/atoms/Divider'
import NavBar from '../../../components/atoms/NavBar'
import PeriodStrip from '../../../components/atoms/PeriodStrip'
import { ShimmerTripDetail } from '../../../components/atoms/shimmer/Shimmer'
import Colors from '../../../constants/Colors'
import translate from '../../../locales/translate'
import { getTripDetail } from '../../../services/report'

const TripDetailScreen = ({ navigation, route }) => {

    const { id } = route.params

    const [data, setdata] = useState([])
    const [childrenData, setChildrenData] = useState()
    const [selectedIndex, setSelectedIndex] = useState()
    const [isLoading, setisLoading] = useState(true)

    const getTripDetailApi = () => {
        setisLoading(true)
        getTripDetail(id).then(response => {
            setdata(response.reverse())
            setSelectedIndex(0)
            setChildrenData([...response[0].trips])
            setisLoading(false)
        }).catch(err => {
            showDialog(err.message)
        })
    }

    const onSelectTab = (index) => {
        setSelectedIndex(index)
        setChildrenData([...data[index].trips])
    }

    useEffect(() => {
        getTripDetailApi()
    }, [])

    return <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
        <NavBar navigation={navigation} title={translate('trip_detail')} />
        {isLoading ? <ShimmerTripDetail/> : 
        <View>
            <BlueHeader title={data[selectedIndex]?.period.split(' ')[0]} sub={data[selectedIndex]?.period?.split(' ')[1]} />
            <View style={{ width: '100%', backgroundColor: Colors.lightPrimary, height: 50 }}>
                <FlatList
                    horizontal={true}
                    data={data}
                    keyExtractor={item => item.period}
                    inverted={true}
                    renderItem={({ item, index }) => {
                        return <PeriodStrip text={item.period} isSelected={index == selectedIndex} onPress={() => onSelectTab(index)} />
                    }}
                />
            </View>
            <FlatList
                data={childrenData}
                keyExtractor={item => item.start_date + item.distance}
                renderItem={({ item, index }) => {
                    return <View style={{ marginHorizontal: 16, marginTop: 16 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                            <LatoRegular style={{ color: Colors.primary }}>{moment(item.start_date).format('DD MMMM YYYY')}</LatoRegular>
                            <LatoRegular style={{ color: Colors.primary }}>{item.distance + 'Km'}</LatoRegular>
                        </View>
                        <Divider />
                    </View>
                }}
            />
        </View>}
    </SafeAreaView>

}

export default TripDetailScreen
