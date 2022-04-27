import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import EmptyContract from '../../../components/atoms/EmptyContract'
import NavBar from '../../../components/atoms/NavBar'
import translate from '../../../locales/translate'

import IconHistory from '../../../assets/images/ic_contract_history.svg'
import IconLocation from '../../../assets/images/ic_home_location.svg';
import IconReport from '../../../assets/images/ic_report.svg'

import { ShimmerOfferDetail } from '../../../components/atoms/shimmer/Shimmer'
import { getContract } from '../../../services/contract'
import { showDialog } from '../../../actions/commonActions'
import { Image } from 'react-native-elements'
import { LatoBold, LatoRegular } from '../../../components/atoms/CustomText'
import { displayProvince, getFullLink, openMaps, toCurrency } from '../../../actions/helper'
import StatusTag from '../../../components/atoms/StatusTag'
import Colors from '../../../constants/Colors'
import moment from 'moment'
import Divider from '../../../components/atoms/Divider'
import ListInstallationSchedule from '../../../components/atoms/list/ListInstallationSchedule'
import KeyValueComponent from '../../../components/atoms/KeyValueComponent'
import axios from 'axios'
import { getChartData, getReportList } from '../../../services/report'
import ListReport from '../../../components/atoms/list/ListReport'
import DistanceChart from '../../../components/atoms/DistanceChart'

const CurrentContractScreen = ({navigation, route}) => {

    const [contractData, setcontractData] = useState()
    const [reportData, setreportData] = useState([])
    const [chartData, setChartData] = useState([])

    const [isLoading, setisLoading] = useState(true)
    const {id, isEmpty} = route.params

    const seeOffer = () => {
        navigation.navigate('Offer')
    }

    const getAdsDate = () => {
        const start = moment(contractData.start_date)
        const end = moment(contractData.end_date)
        if (start.format('YYYY') != end.format('YYYY')) {
            return start.format('DD MMMM YYYY') + ' - ' + end.format('DD MMMM YYYY')
        } else if (start.format('MM') != end.format('MM')) {
            return start.format('DD MMMM') + ' - ' + end.format('DD MMMM YYYY')
        } else {
            return start.format('DD') + ' - ' + end.format('DD MMMM YYYY')
        }
    }

    const goToTripDetail = () => {
        navigation.navigate('TripDetail', {id: id})
    }

    const goToCrudReport = (isAdd, id) => {
        // navigation.navigate('CrudReport', {isAdd: isAdd, id: id, sticker_area: contractData.campaign.sticker_area})
        navigation.navigate('CrudReport', {isAdd: isAdd, id: id, stickerArea: contractData.campaign.sticker_area})
    }

    useEffect(() => {
        if (id) {
            axios.all([
                getReportList(id),
                getContract(id),
                getChartData(id)
            ]).then(axios.spread(async (report, contract, chart) => {
                setcontractData(contract)
                setreportData(report)
                setChartData(chart)
                setisLoading(false)
            })).catch(err => {
                showDialog(err.message)
            })
        }
    }, [])
    

    return <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <NavBar 
            title={translate('active_contract')} 
            navigation={navigation} 
            shadowEnabled 
            RightView={
                <TouchableOpacity onPress={() => navigation.navigate('ContractHistory')}>
                    <IconHistory/>
                </TouchableOpacity>
            } />
        {!isEmpty ? (isLoading ? <ShimmerOfferDetail containerStyle={{padding: 16}}/> :
            <ScrollView style={{flex: 1}}>
                <View style={{flex: 1, marginBottom: 16}}>

                    <View style={{ flexDirection: 'row', padding: 16 }}>
                        <Image source={{ uri: getFullLink(contractData?.campaign.company_image) }} style={{ height: 64, width: 'auto', aspectRatio: 1 }} />

                        <View style={{ paddingLeft: 16, flex: 1 }}>
                            <LatoBold style={{ color: '#6D6D6D' }}>{contractData.campaign.company_name}</LatoBold>
                            <LatoRegular
                                style={{ color: Colors.primary, fontSize: 10, paddingVertical: 10 }}
                                Icon={IconLocation}>{displayProvince(contractData.campaign.contract_area)}</LatoRegular>
                            <LatoRegular
                                style={{ fontSize: 10, color: '#A7A7A7' }}
                            >{translate('from_', {date: getAdsDate()})}</LatoRegular>
                            <StatusTag text={contractData.campaign.status} containerStyle={{marginTop: 10}}/>
                        </View>

                    </View>

                    <Divider />

                    <View style={{ padding: 16, justifyContent: 'space-between', flexDirection: 'row' }}>
                        <LatoBold style={{ color: Colors.primary }}>{translate('installation_time_title')}</LatoBold>
                        <TouchableOpacity onPress={() => navigation.navigate('InstallationList', {contractData: contractData.campaign.installation_schedule})}>
                            <LatoBold style={{ textDecorationLine: 'underline', color: Colors.secondary }}>{translate('see_all')}</LatoBold>
                        </TouchableOpacity>
                    </View>

                    {
                        contractData.campaign.installation_schedule && contractData.campaign.installation_schedule.map((item, index) => {
                            return <ListInstallationSchedule data={item} onPressMap={() => openMaps(Number(item.lat), Number(item.lng))} />
                        })
                    }

                    <Divider/>

                    <View style={{padding: 16}}>
                            <KeyValueComponent title={translate('profit')} value={toCurrency(contractData.total_profit)} isBold style={styles.subHeading}/>
                            <KeyValueComponent title={translate('price_per_kilos')} value={toCurrency(contractData.campaign.price_km)} style={styles.subHeading}/>
                    </View>

                    <Divider/>

                    <View style={{padding: 16}}>
                            <KeyValueComponent title={translate('transferred')} value={moment(contractData.date_transfer).format('DD MMMM YYYY')} isBold style={styles.subHeading}/>
                            <KeyValueComponent title={translate('bank_account')} value={contractData.bank_number} style={styles.subHeading}/>
                    </View>

                    <Divider/>

                    <View style={{padding: 16}}>
                    <LatoBold Icon={IconReport} style={{color: Colors.primary}}>{translate('trip_report')}</LatoBold>
                            <KeyValueComponent title={translate('driver_status')} value={contractData.status} style={styles.subHeading} containerStyle={{marginTop: 10}}/>
                            <KeyValueComponent title={translate('vehicle_type')} value={contractData.vehicle_type} style={styles.subHeading} />
                            <KeyValueComponent title={translate('ads_type')} value={contractData.campaign.sticker_area.length == 1 ? contractData.campaign.sticker_area[0].name : contractData.sticker_area.map(item => item.name).join(', ')} style={styles.subHeading} />
                            <KeyValueComponent title={translate('total_trip')} value={contractData.total_distance + 'Km'} style={styles.subHeading} />
                            <KeyValueComponent title={translate('trip_today')} value={contractData.today_distance + 'Km'} style={styles.subHeading} />
                    </View>

                    {
                        chartData.length > 0 && <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <DistanceChart data={chartData}/>
                            <TouchableOpacity onPress={goToTripDetail}>
                                <LatoRegular style={{marginTop: 16, color: Colors.primarySecondary, fontSize: 10, textDecorationLine: 'underline'}}>{translate('see_detail')}</LatoRegular>
                            </TouchableOpacity>
                        </View>
                    }


                    {
                        reportData?.map((value, index) => {
                            return <ListReport data={value} onPress={goToCrudReport}/>
                        })
                    }

                </View>

            </ScrollView>) :
            <EmptyContract desc={translate('no_active_contract')} onPress={seeOffer}/>
        }
    </SafeAreaView>
}

const styles = StyleSheet.create({
    subHeading: {
        color: Colors.primary,
        fontSize: 12
    }
})

export default CurrentContractScreen