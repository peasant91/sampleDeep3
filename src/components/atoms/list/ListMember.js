import React from 'react'
import { View } from 'react-native'
import Colors from '../../../constants/Colors'
import translate from '../../../locales/translate'
import { MemberInput } from '../CustomInput'

const ListMember = ({index, dispatch, nameValue, nrpValue, isCheck}) => {
    return (
        <View>
            <MemberInput
                containerStyle={{margin: 16}}
                nameTitle={translate('team_name_title', {int: index})}
                namePlaceholder={translate('team_placeholder')}
                nameValue={nameValue}
                nrpTitle={translate('team_nrp_title', {int: index})}
                nrpPlaceholder={translate('nrp_placeholder')}
                nrpValue={nrpValue}
                dispatcher={dispatch}
                index={index}
                isCheck={isCheck}
            />
            <View style={{height: 10, backgroundColor: Colors.divider, marginTop: 16}}/>
        </View>
    )
}

export default ListMember