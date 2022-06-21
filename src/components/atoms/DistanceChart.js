import React from 'react'
import { View, Dimensions } from 'react-native'
import { LineChart } from 'react-native-chart-kit'
import Colors from '../../constants/Colors'
import moment from 'moment'
import { momentx } from '../../actions/helper'

const DistanceChart = ({data}) => {

  const label = data.map((value) => momentx(value.date).format('DD/MM'))
  const dataset = data.map((value) => parseInt(value.distance))

    return   <LineChart
    data={{
      labels: label.length > 0 ? label.reverse() : [momentx(Date()).format('DD/MM')],
      datasets: [
        {
          data: dataset.length > 0 ? dataset.reverse() : [0],
          strokeWidth: 1,
        }
      ]
    }}
    width={Dimensions.get("window").width - 32} // from react-native
    height={220}
    yAxisSuffix="km"
    yAxisInterval={1} // optional, defaults to 1
    withVerticalLines={true}
    withOuterLines={true}
    withInnerLines={dataset.length > 1 ? true : false}
    yLabelsOffset={16}
    chartConfig={{
      backgroundGradientFrom: 'white',
      backgroundGradientTo: 'white',
      barPercentage: 0.1,
      decimalPlaces: 0, // optional, defaults to 2dp
      color: (opacity = 1) => Colors.greyDark,
      labelColor: (opacity = 1) => Colors.secondary,
      style: {
          paddingTop: 20,
          marginLeft: -20
      },
      paddingTop: 20,
      paddingRight: 20,
      horizontalOffset: 10,
      propsForDots: {
        r: "2",
        strokeWidth: "4 ",
        stroke: Colors.secondary,
        
      },
      propsForBackgroundLines: {
          // color: 'black',
          // backgroundColor: 'black'
      }
    }}
    style={{
      borderRadius: 10
    }}
  />
}

export default DistanceChart