import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {View, StyleSheet} from 'react-native';
import Divider from '../Divider';

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

export const ShimmerHomeProfile = () => {
  return <View style={{flexDirection: 'row'}}>
      <ShimmerPlaceholder height={40} width={40} style={{borderRadius: 900}}/>
      <View style={{marginLeft: 16}}>
        <ShimmerPlaceholder width={100}/>
        <ShimmerPlaceholder style={{marginTop: 10}}/>
      </View>
  </View>
}

export const ShimmerHomeBody = ({containerStyle}) => {
  return <View style={containerStyle}>
    <ShimmerPlaceholder style={{marginBottom: 16}}/>
    <ShimmerCardContract/>
    <ShimmerPlaceholder style={{marginVertical: 16}}/>
    <ShimmerPlaceholder style={{height: 160, width: '100%'}}/>
  </View>
}

export const ShimmerOfferDetail = ({containerStyle}) => {
  return <View style={containerStyle}>
    <View style={{flexDirection: 'row'}}>
      <ShimmerPlaceholder height={60} width={60}/>
      <View style={{marginLeft: 10,justifyContent: 'space-between'}}>
        <ShimmerPlaceholder />
        <ShimmerPlaceholder width={120} />
        <ShimmerPlaceholder width={220} />
      </View>
    </View>
    <View style={{height: 130, justifyContent: 'space-between', marginTop: 32}}>
        <ShimmerPlaceholder width={120} />
        <ShimmerPlaceholder width={250} style={{marginTop: 10}} />
        <ShimmerPlaceholder width={200} />
        <ShimmerPlaceholder width={240} />
        <ShimmerPlaceholder width={280} />
    </View>
    <View style={{height: 420, justifyContent: 'space-between', marginTop: 24}}>
        <ShimmerPlaceholder width={120} />
        <ShimmerPlaceholder style={{width: '100%', height: 120}} />
        <ShimmerPlaceholder style={{width: '100%', height: 120}} />
        <ShimmerPlaceholder style={{width: '100%', height: 120}} />
    </View>
  </View>
}

export const ShimmerAccoutTopHeader = ({isLoading}) => {
  return (
    <View
      style={{flex: 1, marginRight: 16, borderColor: 'gray', flexDirection: 'row' }}>
      <ShimmerPlaceholder visible={isLoading} width={48} height={48} style={{borderRadius: 900}} />
      <View style={{marginLeft: 16, justifyContent: 'center'}}>
      <ShimmerPlaceholder
        visible={isLoading}
        width={170}
        height={17}
      />
      <ShimmerPlaceholder
        visible={isLoading}
        width={180}
        height={17}
        style={{marginTop: 10}}
      />
      </View>
    </View>
  );
};
export const ShimmerCardContract = ({containerStyle}) => {

  return (
    <View  style={containerStyle}>
      <View style={styles.container}>
        <View style={{flexDirection: 'row', padding: 16}}>
          <ShimmerPlaceholder
            style={{height: 64, width: undefined, aspectRatio: 1}}
            resizeMode={'center'}
          />
          <View style={{paddingLeft: 16, justifyContent: 'space-between'}}>
            <ShimmerPlaceholder/>
            <ShimmerPlaceholder width={120}/>
            <ShimmerPlaceholder/>
          </View>
        </View>

          <View>
            <Divider />
            <ShimmerPlaceholder
              style={{marginVertical: 8, marginLeft: 16}}
              />
            <Divider />
          </View>
        

        <View
          style={{
            flexDirection: 'row',
            margin: 16,
            justifyContent: 'space-between',
          }}>
          <ShimmerPlaceholder width={100} />
          <ShimmerPlaceholder width={70}/>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    backgroundColor: 'white',
    elevation: 2,
  },
});


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


export const shimmerStyle = StyleSheet.create({
  shimmer: {
    borderRadius: 16,
  },
});
