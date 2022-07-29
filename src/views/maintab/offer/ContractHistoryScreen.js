import { FlatList, RefreshControl, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import NavBar from '../../../components/atoms/NavBar'
import translate from '../../../locales/translate'
import EmptyContract from '../../../components/atoms/EmptyContract'
import { getContractHistory } from '../../../services/contract'
import { showDialog } from '../../../actions/commonActions'
import { dummyContractShimmer } from './OfferScreen'
import { ShimmerCardContract } from '../../../components/atoms/shimmer/Shimmer'
import CardContract from '../../../components/atoms/list/CardContract'


const ContractHistoryScreen = ({ navigation, route }) => {

    const [data, setdata] = useState()
    const [isLOading, setisLOading] = useState(true)
    const page = useRef(1)
    const canLoadMore = useRef(true)

    const getHistory = () => {
        if (canLoadMore) {
            if (page == 1) {
                setisLOading(true)
            }
            getContractHistory({
                page: page.current
            }).then(response => {
                if (page.current == 1) {
                    setdata(response)
                } else {
                    setdata([...data, ...response])
                }
                canLoadMore.current = response.length == 0
                page.current += 1
                setisLOading(false)
            }).then(err => {
                setisLOading(false)
                showDialog(err.message)
            })
        }
    }

    const goToDetail = (item) => {
        navigation.push('CurrentContract', {id: item.contract_id, isEmpty: false, isCurrent: false})
    }

  const onRefresh = () => {
    canLoadMore.current = true
    page.current = 1
    getHistory()
  }

    useEffect(() => {
        getHistory()
    }, [])


    return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <NavBar title={translate('offer_history')} navigation={navigation} shadowEnabled />
        {isLOading ?
            dummyContractShimmer.map((item, index) => {
                return <ShimmerCardContract
                    containerStyle={{ marginHorizontal: 16, marginTop: 16 }}
                />
            })
            : 
            (data.length > 0 
                ? 
          <FlatList
            refreshControl={<RefreshControl
              refreshing={isLOading}
              onRefresh={onRefresh}
            />}
            data={data}
            contentContainerStyle={{ paddingBottom: 16, overflow: 'visible' }}
            keyExtractor={item => item.id}
            onEndReachedThreshold={0.2}
            onEndReached={getHistory}
            renderItem={({ item, index }) => {
              return (
                <CardContract
                  containerStyle={{ marginHorizontal: 16, marginTop: 16 }}
                  data={item}
                  onPress={() => goToDetail(item)}
                />
              )
            }}
          />
            : <EmptyContract desc={translate('no_history_contract')} />)}
    </SafeAreaView>
}

export default ContractHistoryScreen