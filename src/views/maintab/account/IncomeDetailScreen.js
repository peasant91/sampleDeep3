import { FlatList, View, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import NavBar from '../../../components/atoms/NavBar'
import translate from '../../../locales/translate'
import { getIncomeList } from '../../../services/transaction'
import { showDialog } from '../../../actions/commonActions'
import moment from 'moment'
import { momentx } from '../../../actions/helper'
import { range, toCurrency } from '../../../actions/helper'
import { ShimmerIncome, ShimmerTripDetail } from '../../../components/atoms/shimmer/Shimmer'
import PeriodStrip from '../../../components/atoms/PeriodStrip'
import BlueHeader from '../../../components/atoms/BlueHeader'
import { LatoBold, LatoRegular, LatoSemiBold } from '../../../components/atoms/CustomText'
import Colors from '../../../constants/Colors'
import Divider from '../../../components/atoms/Divider'
import IconPendapatan from '../../../assets/images/pendapatan.svg'
import IconPenarikan from '../../../assets/images/penarikan.svg'

const IncomeDetailScreen = ({ navigation, route }) => {

    const currentYear = momentx(Date()).format('yyyy')
    const [data, setdata] = useState({})
    const [selectedYear, setselectedYear] = useState(currentYear)
    const availableYear = range(currentYear - 10, currentYear)
    const [isLoading, setisLoading] = useState(true)

    const getDetail = (year) => {
        setisLoading(true)
        getIncomeList({
            year: year
        }).then(response => {
            setisLoading(false)
            setdata(response)
        }).catch(err => {
            setisLoading(false)
            showDialog(err.message)
        })
    }

    const onSelectTab = (index) => {
        setselectedYear(availableYear[index])
    }

    useEffect(() => {
        getDetail(selectedYear)
    }, [selectedYear])


    return <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
        <NavBar navigation={navigation} title={translate('total_income')} />
        <View>
            <BlueHeader title={toCurrency(data.total)} sub={selectedYear} />
            <View style={{ width: '100%', backgroundColor: Colors.lightPrimary, height: 50 }}>
                <FlatList
                    horizontal={true}
                    data={availableYear.reverse()}
                    keyExtractor={item => item.period}
                    showsHorizontalScrollIndicator={false}
                    inverted={true}
                    renderItem={({ item, index }) => {
                        return <PeriodStrip text={item} isSelected={item == selectedYear} onPress={() => onSelectTab(index)} />
                    }}
                />
            </View>
            {
                isLoading ? <ShimmerIncome containerStyle={{ margin: 16 }} /> :
                    <FlatList
                        data={data.transaction}
                        keyExtractor={item => item.date}
                        renderItem={({ item, index }) => {
                            return <View style={{ marginHorizontal: 16, marginTop: 16 }}>
                                {
                                    item.type == 1 ? //item type 1 is income
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 16 }}>
                                            <View style={{marginEnd:10}}>
                                                <IconPendapatan/>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between',flex:1 }}>
                                                <View style={{ }}>
                                                    <LatoBold style={{ color: 'black' }}>{item.title}</LatoBold>
                                                    <LatoRegular style={{ color: Colors.dateGray,marginTop:5 }}>{momentx(item.date).format('DD MMMM YYYY')}</LatoRegular>
                                                </View>
                                                <View style={{ }}>
                                                    <LatoSemiBold style={{ color: Colors.primarySecondary }}>2000000</LatoSemiBold>
                                                    <LatoRegular style={{ color: Colors.primary,marginTop:5 }}>{item.status}</LatoRegular>
                                                </View>
                                            </View>
                                        </View>
                                        :
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 16 }}>
                                        <View style={{marginEnd:10}}>
                                            <IconPendapatan/>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between',flex:1 }}>
                                            <View style={{ }}>
                                                <LatoBold style={{ color: 'black' }}>{item.title}</LatoBold>
                                                <LatoRegular style={{ color: Colors.dateGray }}>{momentx(item.date).format('DD MMMM YYYY')}</LatoRegular>
                                            </View>
                                            <View style={{ }}>
                                                <LatoSemiBold style={{ color: Colors.primarySecondary }}>2000000</LatoSemiBold>
                                                <LatoRegular style={{ color: Colors.primary }}>{item.status}</LatoRegular>
                                            </View>
                                        </View>
                                    </View>
                                }
                                <Divider />
                            </View>
                        }}
                    />
            }
        </View>
    </SafeAreaView>

}

export default IncomeDetailScreen