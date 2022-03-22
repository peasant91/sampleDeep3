import React from 'react'
import { View, Dimensions } from 'react-native'
import { LineChart } from 'react-native-chart-kit'
import Colors from '../../constants/Colors'


const HomeLineChart = (data) => {
    return   <LineChart
    data={{
      labels: ["9/01/22", "10/01/22", "11/01/22", "12/01/22", "13/01/22"],
      datasets: [
        {
          data: [
              10,20,15,25,20,30,40
          ]
        }
      ]
    }}
    width={Dimensions.get("window").width - 32} // from react-native
    height={220}
    yAxisSuffix="km"
    yAxisInterval={1} // optional, defaults to 1
    withVerticalLines={false}
    chartConfig={{
      backgroundGradientFrom: Colors.primary,
      backgroundGradientTo: Colors.primary,
      useShadowColorFromDataset: false,
      barPercentage: 0.1,
      decimalPlaces: 0, // optional, defaults to 2dp
      color: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
          paddingTop: 10
      },
      paddingTop: 10,
      paddingRight: 20,
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

export default HomeLineChart