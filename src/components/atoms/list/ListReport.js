import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { LatoBold, LatoRegular } from '../CustomText'
import Divider from '../Divider'
import translate from '../../../locales/translate'
import moment from 'moment'
import Colors from '../../../constants/Colors'

// import IconNoReport from '../../../assets/images/ic_no_report'
// import IconEmptyReport from '../../../assets/images/ic_empty_report'
import { addDate, isBeforeDate } from '../../../actions/helper'

const ListReport = ({data, onPress}) => {

    const NoReport = () => {
        return <View style={{backgroundColor: '#FFF8F8', borderRadius: 4, padding: 16, alignItems: 'center', marginTop: 10}}>
            <IconNoReport/>
            <LatoRegular style={{color: '#CB3A31'}} containerStyle={{marginTop: 5}}>{translate('no_report')}</LatoRegular>
        </View>
    }

    const EmptyReport = () => {
        return <TouchableOpacity 
                style={{backgroundColor: '#EFEFFF', borderRadius: 4, padding: 16, alignItems: 'center', marginTop: 10}} 
                onPress={() => onPress(true, data.id)}>
            <IconEmptyReport/>
            <LatoRegular containerStyle={{marginVertical: 5}}>{translate('empty_report')}</LatoRegular>
            <LatoRegular style={{textDecorationLine: 'underline', color: Colors.primarySecondary}}>{translate('add_now')}</LatoRegular>
        </TouchableOpacity>
    }

    const Report = () => {
        return <View>
            <LatoBold style={{fontSize: 12}} containerStyle={{marginTop: 10, marginBottom: 5}}>{translate('report_detail')}</LatoBold>
            <LatoRegular style={{fontSize: 12}}>{data.desc}</LatoRegular>
        </View>
    }

    const isStillAbleAdd = () => {
        //forigiven date is masa tenggang you still able to create/update report
        //and then check if today's date is before or in same day with forgivenDate
        var forgivenDate = moment(data.start_date).add(9,'days')
        const today = moment(Date()).startOf('day')
        return isBeforeDate(today,forgivenDate)
    }

    return <View style={{paddingTop: 16, paddingHorizontal: 16}}>
        <Divider/>
        <View style={{flexDirection: 'row', marginTop: 16, justifyContent: 'space-between'}}>
            <LatoBold>{moment(data.start_date).format('DD MMM YYYY')}</LatoBold>
            {data.is_driver && data.desc && <TouchableOpacity onPress={() => onPress(false, data.id,false)}><LatoBold style={{textDecorationLine: 'underline', color: Colors.primarySecondary}}>{translate('see_report')}</LatoBold></TouchableOpacity>}
        </View>
        {
            data.is_driver ?
            <Report/> : (
                isStillAbleAdd() ? <EmptyReport/> : <NoReport/>
            )

        }
    </View>
}

export default ListReport