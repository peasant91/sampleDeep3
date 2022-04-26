import React from 'react'
import { View, Dimensions } from 'react-native'
import { LineChart } from 'react-native-chart-kit'
import Colors from '../../constants/Colors'
import moment from 'moment'


const DistanceChart = ({data}) => {

  const label = data.map((value) => moment(value.date).format('DD/MM'))
  const dataset = data.map((value) => parseInt(value.distance))

    return   <LineChart
    data={{
      labels: label.reverse(),
      datasets: [
        {
          data: dataset.length > 0 ? dataset.reverse() : [0]
        }
      ]
    }}
    width={Dimensions.get("window").width - 32} // from react-native
    height={220}
    yAxisSuffix="km"
    yAxisInterval={1} // optional, defaults to 1
    withVerticalLines={false}
    yLabelsOffset={16}
    chartConfig={{
      backgroundGradientFrom: Colors.primary,
      backgroundGradientTo: Colors.primary,
      useShadowColorFromDataset: false,
      barPercentage: 0.1,
      decimalPlaces: 0, // optional, defaults to 2dp
      color: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
          paddingTop: 20
      },
      paddingTop: 20,
      paddingRight: 20,
      horizontalOffset: 10,
      propsForDots: {
        r: "5",
        strokeWidth: "2",
        stroke: Colors.primary,
        
      },
      propsForBackgroundLines: {
          
      }
    }}
    style={{
      borderRadius: 10
    }}
  />
}

export default DistanceChart