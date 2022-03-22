import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {View, StyleSheet} from 'react-native';

const Shimmer = createShimmerPlaceholder(LinearGradient);

export const ShimmerPlaceholder = ({style, children, width, height, isLoading=true, disableCurve}) => {
  return (
    <Shimmer
        visible={!isLoading}
      width={width}
      height={height}
      style={[{borderRadius: disableCurve ? 0 : 16}, style]}>
      {children}
    </Shimmer>
  );
};

export const ShimmerNews = ({isLoading}) => {
  return (
    <View
      style={{flex: 1, marginBottom: 16, marginRight: 16, borderColor: 'gray'}}>
      <ShimmerPlaceholder visible={isLoading} width={170} height={100} />
      <ShimmerPlaceholder
        visible={isLoading}
        width={170}
        style={{marginTop: 10}}
      />
    </View>
  );
};

export const ShimmerNewsList = ({isLoading}) => {
  return (
    <View
      style={{
        flex: 1,
        marginBottom: 16,
        marginRight: 16,
        borderColor: 'gray',
        flexDirection: 'row',
      }}>
      <View style={{flex: 1, marginLeft: 16}}>
        <View style={{marginRight: 20}}>
          <ShimmerPlaceholder
            visible={isLoading}
            style={{width: '100%', marginTop: 16, marginRight: 10}}
          />
        </View>
        <ShimmerPlaceholder visible={isLoading} height={10} style={{marginTop: 5}}/>
      </View>
      <ShimmerPlaceholder visible={isLoading} width={82} height={82} />
    </View>
  );
};

export const ShimmerProjectList = ({isLoading}) => {
  return (
    <View
      style={{
        flex: 1,
        marginTop: 16,
        marginBottom: 16,
        marginRight: 16,
        borderColor: 'gray',
        flexDirection: 'row',
      }}>
      <View style={{flex: 1, marginLeft: 16}}>
        <View style={{marginRight: 20}}>
          <ShimmerPlaceholder
            visible={isLoading}
            style={{width: '100%', marginTop: 16, marginRight: 10}}
          />
        </View>
        <ShimmerPlaceholder visible={isLoading} height={10} style={{marginTop: 5}}/>
        <View style={{marginRight: 20}}>
          <ShimmerPlaceholder
            visible={isLoading}
            style={{width: '100%', marginTop: 16, marginRight: 10}}
          />
        </View>
        <ShimmerPlaceholder visible={isLoading} height={10} style={{marginTop: 5}}/>
      </View>
      {/* <ShimmerPlaceholder visible={isLoading} width={82} height={5} /> */}
    </View>
  );
};

export const TarrifShimmer = ({isLoading}) => {
  return (
    <View
      style={{
        flex: 1,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        margin: 16,
        borderColor: 'gray',
      }}>
      <ShimmerPlaceholder visible={isLoading} width={200} />
      <ShimmerPlaceholder
        visible={isLoading}
        width={100}
        style={{marginTop: 10}}
      />
      <ShimmerPlaceholder
        visible={isLoading}
        width={300}
        style={{marginTop: 10}}
      />
    </View>
  );
};

export const shimmerStyle = StyleSheet.create({
  shimmer: {
    borderRadius: 16,
  },
});
