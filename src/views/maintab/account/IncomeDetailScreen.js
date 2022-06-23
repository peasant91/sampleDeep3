import { FlatList, View, Image, StyleSheet } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import NavBar from '../../../components/atoms/NavBar'
import translate from '../../../locales/translate'
import { createWithdraw, getIncomeList } from '../../../services/transaction'
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
import CustomButton from '../../../components/atoms/CustomButton'
import CustomSheet from '../../../components/atoms/CustomSheet'

const statusText = (status) => {
    switch (status) {
        case "pending":
            return "Pending"
        case "in_progress":
            return "Menunggu Konfirmasi"
        case "finish":
            return "Selesai"
    }
}

const IncomeDetailScreen = ({ navigation, route }) => {

    const currentYear = momentx(Date()).format('yyyy')
    const [data, setdata] = useState({})
    const [selectedYear, setselectedYear] = useState(currentYear)
    const availableYear = range(currentYear - 10, currentYear)
    const [isLoading, setisLoading] = useState(true)
    const withdrawSheet = useRef();

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

    const openWithdrawConfirmation = () => {
        setTimeout(() => {
            withdrawSheet.current.expand()
        }, 100);
    }

    const requestWithdraw = () => {
        withdrawSheet.current.close()
        createWithdraw().then(response => {
            getDetail(year)
        }).catch(err => {
            showDialog(err.message)
        })
    }

    const onSelectTab = (index) => {
        setselectedYear(availableYear[index])
    }

    useEffect(() => {
        getDetail(selectedYear)
    }, [selectedYear])

    const statusStyle = (status) => {
        switch (status) {
            case "pending":
                return {
                    ...styles.statusContainer,
                    color: Colors.darkBrown,
                    backgroundColor: Colors.lightBrown,
                    marginTop: 5
                }
            case "in_progress":
                return {
                    ...styles.statusContainer,
                    color: Colors.darkBrown,
                    backgroundColor: Colors.lightBrown,
                    marginTop: 5
                }
            case "finish":
                return {
                    ...styles.statusContainer,
                    color: Colors.primary,
                    backgroundColor: Colors.lightPrimary,
                    marginTop: 5
                }
        }
    }


        return <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
            <NavBar navigation={navigation} title={translate('total_income')} />
            <View style={{ flex: 1 }}>
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
                <View style={{ flex: 1 }}>
                    {
                        isLoading ? <ShimmerIncome containerStyle={{ margin: 16 }} /> :
                            <FlatList
                                contentContainerStyle={{ flexGrow: 1 }}
                                data={data.transaction}
                                keyExtractor={item => item.date}
                                renderItem={({ item, index }) => {
                                    return <View style={{ marginHorizontal: 16, marginTop: 16 }}>
                                        {
                                            item.type == 1 ? //item type 1 is income
                                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 16 }}>
                                                    <View style={{ marginEnd: 10 }}>
                                                        <IconPendapatan />
                                                    </View>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                                                        <View style={{ flex:0.5 }}>
                                                            <LatoBold style={{ color: 'black' }}>{item.title}</LatoBold>
                                                            <LatoRegular style={{ color: Colors.dateGray,marginTop:5 }}>{momentx(item.date).format('DD MMMM YYYY')}</LatoRegular>
                                                        </View>
                                                        <View style={{alignItems:'flex-end',flex:0.5}}>
                                                            <LatoBold style={{ color: Colors.secondary }}>{toCurrency(item.amount)}</LatoBold>
                                                            <LatoRegular style={statusStyle(item.status)}>{statusText(item.status)}</LatoRegular>
                                                        </View>
                                                    </View>
                                                </View>
                                                :
                                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 16 }}>
                                                    <View style={{ marginEnd: 10 }}>
                                                        <IconPenarikan />
                                                    </View>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                                                    <View style={{ flex:0.5 }}>
                                                            <LatoBold style={{ color: 'black' }}>{item.title ?? "test"}</LatoBold>
                                                            <LatoRegular style={{ color: Colors.dateGray,marginTop:5 }}>{momentx(item.date).format('DD MMMM YYYY')}</LatoRegular>
                                                        </View>
                                                        <View style={{alignItems:'flex-end',flex:0.5}}>
                                                            <LatoBold style={{ color: Colors.darkRed }}>{"-" + toCurrency(item.amount)}</LatoBold>
                                                            <LatoRegular style={statusStyle(item.status)}>{statusText(item.status)}</LatoRegular>
                                                        </View>
                                                    </View>
                                                </View>
                                        }
                                        <Divider />
                                    </View>
                                }}
                            />
                    }
                    {
                        data.total > 0 && (
                            <CustomButton
                                types="primary"
                                title={translate('withdraw')}
                                containerStyle={{ marginVertical: 16, marginHorizontal: 16 }}
                                onPress={openWithdrawConfirmation}
                                isLoading={isLoading}
                            />
                        )
                    }
                </View>
            </View>
            <CustomSheet
                ref={withdrawSheet}
            >
                <View style={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 8, alignItems: 'center' }}>
                    <LatoBold style={{ color: Colors.primary, fontSize: 18 }}>{translate('withdraw_confirmation_title')}</LatoBold>
                    <LatoRegular style={{ textAlign: 'center', marginTop: 8 }}>{translate('withdraw_confirmation_desc')}</LatoRegular>
                    <View style={{ flexDirection: 'row', marginTop: 24 }}>
                        <View style={{ flex: 1 }}>
                            <CustomButton
                                types="secondary"
                                onPress={() => {
                                    withdrawSheet.current.close()
                                }}
                                style={{ height: 40, marginHorizontal: 2 }}
                                title={translate('cancel_short')}
                            />
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <CustomButton
                                types="primary"
                                onPress={requestWithdraw}
                                style={{ height: 40, marginHorizontal: 2 }}
                                title={translate('sure')}
                            />
                        </View>
                    </View>
                </View>
            </CustomSheet>
        </SafeAreaView>
    }

    const styles = StyleSheet.create({
        statusContainer: {
            paddingStart: 8,
            paddingEnd: 8,
            paddingTop: 4,
            paddingBottom: 4,
            borderRadius: 5
        }
    })

    export default IncomeDetailScreen