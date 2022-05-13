import { FlatList, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import NavBar from '../../../components/atoms/NavBar'
import translate from '../../../locales/translate'
import { getIncomeList } from '../../../services/transaction'
import { showDialog } from '../../../actions/commonActions'
import moment from 'moment'
import { range, toCurrency } from '../../../actions/helper'
import { ShimmerIncome, ShimmerTripDetail } from '../../../components/atoms/shimmer/Shimmer'
import PeriodStrip from '../../../components/atoms/PeriodStrip'
import BlueHeader from '../../../components/atoms/BlueHeader'
import { LatoRegular } from '../../../components/atoms/CustomText'
import Colors from '../../../constants/Colors'
import Divider from '../../../components/atoms/Divider'

const IncomeDetailScreen = ({navigation, route}) => {

    const currentYear = moment(Date()).format('yyyy')
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
                isLoading ? <ShimmerIncome containerStyle={{margin: 16}}/> :
            <FlatList
                data={data.incomes}
                keyExtractor={item => item.date}
                renderItem={({ item, index }) => {
                    return <View style={{ marginHorizontal: 16, marginTop: 16 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                            <LatoRegular style={{ color: Colors.primary }}>{moment(item.date).format('DD MMMM YYYY')}</LatoRegular>
                            <LatoRegular style={{ color: Colors.primarySecondary }}>{'+' + toCurrency(item.income)}</LatoRegular>
                        </View>
                        <Divider/>
                    </View>
                }}
            />
            }
        </View>
    </SafeAreaView>

}

export default IncomeDetailScreen