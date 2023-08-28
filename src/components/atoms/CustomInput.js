import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {LatoBold} from './CustomText';
import IndonesiaFlag from '../../assets/images/ic_indonesia_flag.svg';
import ArrowDown from '../../assets/images/ic_arrow_dropdown.svg';
import PasswordHide from '../../assets/images/ic_password_hide.svg';
import PasswordUnhide from '../../assets/images/ic_password_unhide.svg';
import translate from '../../locales/translate';
import Colors from '../../constants/Colors';

const CustomInput = ({
  id,
  title,
  placeholder,
  error,
  value,
  containerStyle,
  onChangeText,
  isCheck,
  dispatcher,
  maxChar,
  multiline,
  keyboardType,
  required,
  viewOnly,
  disabled,
  minChar,
}) => {
  const [errorText, setError] = useState(error);

  const onTextChange = text => {
    if (!viewOnly) {
      let isValid = true;
      var text = text;
      setError(null);
      if (id === 'email') {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (reg.test(text) !== true) {
          isValid = false;
          setError(translate('invalid_email'));
        }
      }

      if (id === 'nrp' && text !== undefined) {
        text = text.replace(/[^0-9]/g, '');
      }

      if (required) {
        if (text == undefined || text?.trim().length <= 0) {
          console.log('error', isCheck)
          isValid = false;
          setError(translate('must_not_empty', {s: title.replace('/?/g', '')}));
        }
      }

      if (minChar) {
        if (text.trim().length < minChar) {
          isValid = false;
          setError(translate('longer_than', {s: minChar}));
        }
      }

      if (maxChar) {
        if (text.length <= maxChar) {
          dispatcher({
            id: id,
            input: text,
            type: 'input',
            isValid: isValid,
          });
        }
      } else {
        dispatcher({
          id: id,
          input: text,
          type: 'input',
          isValid: isValid,
        });
      }
    }
  };

  useEffect(() => {
    onTextChange(value);
  }, [isCheck, required]);

  return (
    <View style={containerStyle} pointerEvents={viewOnly || disabled ? 'none' : 'auto'}>
      <LatoBold style={{fontFamily: 'Lato-Bold'}}>
        {title}{required && <LatoBold style={{color: 'red' }}>*</LatoBold>}
      </LatoBold>
      <TextInput
        value={value}
        onChangeText={!viewOnly && !disabled ? onTextChange : null}
        placeholder={placeholder}
        multiline={multiline}
        keyboardType={keyboardType ?? 'default'}
        containerStyle={{margin: 0, borderWidth: 1}}
        style={[styles.textInputStyle, {borderBottomWidth: viewOnly ? 0 : 1}]}
        inputStyle={
          (styles.textInputInputStyle, {borderBottomWidth: viewOnly ? 0 : 1})
        }
      />
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        {isCheck && errorText ? (
          <LatoBold style={styles.errorContainer}>{errorText}</LatoBold>
        ) : (
          <View />
        )}
        {maxChar ? (
          <LatoBold
            style={styles.counter}>{`${value.length}/${maxChar}`}</LatoBold>
        ) : (
          <View />
        )}
      </View>
    </View>
  );
};

export const PhoneInput = ({
  id,
  title,
  placeholder,
  error,
  value,
  containerStyle,
  onChangeText,
  isCheck,
  dispatcher,
  optional,
  isUnique,
  isUniqueWith,
  viewOnly
}) => {
  const [errorText, setError] = useState(error);

  const onTextChange = text => {

    if (text == undefined){
      return
    }

    let isValid = true;
    setError(null);
    if (!optional){
      if (text == undefined || text.trim().length <= 0) {
        isValid = false;
        setError(translate('must_not_empty', {s: title}));
      }
    }

    if (id === 'phone' || id === 'phone1' || id === 'phone2') {
      let reg = /^(\\+628|08|8|628)([0-9]{9,11})$/;
      if (reg.test(text) !== true) {
        isValid = false;
        setError(translate('invalid_phone'));
      }
    }

    if (id === 'phone2' && isUniqueWith.length > 0){
      if (text === isUniqueWith){
          isValid = false
          setError(translate('invalid_phone_unique'))
      }
    }

    dispatcher({
      id: id,
      input: text,
      type: 'input',
      isValid: isValid,
    });
  };

  useEffect(() => {
    onTextChange(value);
  }, [value]);

  return (
    <View style={containerStyle} pointerEvents={viewOnly ? 'none' : 'auto'}>
      <LatoBold style={{fontFamily: 'Lato-Bold'}}>
        {title}{!optional && <LatoBold style={{color: 'red' }}>*</LatoBold>}
      </LatoBold>
      <View style={{flexDirection: 'row'}}>
        <View
          style={[
            styles.countryContainer,
            // {borderBottomWidth: viewOnly ? 0 : 1},
          ]}>
          <IndonesiaFlag />
          <LatoBold style={{marginLeft: 5}}>+62</LatoBold>
        </View>
        <TextInput
          value={value}
          onChangeText={onTextChange}
          keyboardType="numeric"
          placeholder={placeholder}
          containerStyle={{margin: 0, borderWidth: 1}}
          style={[
            styles.textInputStyle,
            {paddingVertical: 10, borderBottomWidth: viewOnly ? 0 : 1},
          ]}
          inputStyle={[
            styles.textInputInputStyle,
            {borderBottomWidth: viewOnly ? 0 : 1},
          ]}
        />
      </View>
      {isCheck && errorText ? (
        <LatoBold style={styles.errorContainer}>{errorText}</LatoBold>
      ) : (
        <View />
      )}
    </View>
  );
};

export const CurrencyInput = ({
  id,
  title,
  placeholder,
  error,
  value,
  containerStyle,
  onChangeText,
  isCheck,
  dispatcher,
  viewOnly,
  optional,
}) => {
  const [errorText, setError] = useState(error);

  const formatCurrency = x => {
    if (x !== undefined) {
      const cleanFormat = x.toString().replace('/./g', '');
      const formatted = parseInt(cleanFormat)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      if (formatted == 'NaN') {
        return '';
      } else {
        return formatted;
      }
    } else {
      return '';
    }
  };

  const onTextChange = text => {
    if (!viewOnly) {
      let isValid = true;
      // var formatted = formatCurrency(text);
      // console.log(formatted);
      setError(null);

      if (!optional) {
        if (text == undefined || text.trim().length <= 0) {
          isValid = false;
          setError(translate('must_not_empty', {s: title}));
        }
      }

      var formatted = '';

      if (text) {
        formatted = text.replace(/[^0-9]/g, '');
      } else {
        formatted = text;
      }

      if (formatted != null) {
        dispatcher({
          id: id,
          input: formatted,
          type: 'input',
          isValid: isValid,
        });
      }
    }
  }

  onFocus = (text) => {
    console.log('focus', text)
    if (value == 0) {
        dispatcher({
          id: id,
          input: '',
          type: 'input',
          isValid: true,
        });
    }
  }

  onBlur = (text) => {
    if (value == '') {
        dispatcher({
          id: id,
          input: 0,
          type: 'input',
          isValid: true,
        });
    }
    console.log('blur', text)
  }

    useEffect(() => {
      onTextChange(value);
    }, [isCheck]);

    return (
      <View style={containerStyle} pointerEvents={viewOnly ? 'none' : 'auto'}>
        <LatoBold style={{fontFamily: 'Lato-Bold'}}>
          {title + (optional ? translate('optional') : '')}
        </LatoBold>
        <View style={{flexDirection: 'row', borderBottomWidth: viewOnly ? 0 : 1, borderBottomColor: 'gray'}}>
          <View style={[styles.countryContainer,]}>
            <LatoBold style={{marginLeft: 0, fontFamily: 'Lato-Bold'}}>
              Rp
            </LatoBold>
          </View>
          <TextInput
            value={value == '-' || value == 'null' ? value : formatCurrency(value)}
            onChangeText={!viewOnly ? onTextChange : null}
            keyboardType="number-pad"
            placeholder={placeholder}
            containerStyle={{margin: 0, borderWidth: 1}}
            onFocus={onFocus}
            onBlur={onBlur}
            style={[styles.textInputStyle, {paddingVertical: 0, borderBottomWidth: 0}]}
            inputStyle={styles.textInputStyle}
          />
        </View>
        {isCheck && errorText ? (
          <LatoBold style={styles.errorContainer}>{errorText}</LatoBold>
        ) : (
          <View />
        )}
      </View>
    );
  };

export const PickerInput = ({
  id,
  title,
  placeholder,
  error,
  value,
  containerStyle,
  onChangeText,
  onPress,
  Icon,
  isCheck,
  dispatcher,
  viewOnly,
  required,
  disabled,
}) => {
  const [errorText, setError] = useState(error);

  const onTextChange = text => {
    let isValid = true;
    setError(null);

    if (required) {
      if (text == undefined || text.trim().length <= 0) {
        isValid = false;
        setError(translate('must_not_empty', {s: title}));
      }
    }
  };

  useEffect(() => {
    onTextChange(value);
  }, [isCheck, value]);

  return (
    <View style={containerStyle} pointerEvents={viewOnly && !onPress ? 'none' : 'auto'}>
      <LatoBold style={{fontFamily: 'Lato-Bold'}}>
        {title}{required && <LatoBold style={{color: 'red' }}>*</LatoBold>}
      </LatoBold>
      <TouchableOpacity onPress={!disabled ? onPress : null}>
        <View
          pointerEvents="none"
          style={[
            styles.pickerContainer,
            {borderBottomWidth: viewOnly ? 0 : 1},
          ]}>
          <TextInput
            value={value}
            selectTextOnFocus={false}
            contextMenuHidden={true}
            placeholder={placeholder}
            containerStyle={{margin: 0, borderWidth: 1}}
            style={[styles.textInputStyle, {borderBottomWidth: 0}]}
            inputStyle={[styles.textInputInputStyle]}
          />
          {Icon ? (
            <Icon />
          ) : viewOnly ? (
            <View />
          ) : (
            <ArrowDown style={{paddingVertical: 0}} />
          )}
        </View>
      </TouchableOpacity>
      {isCheck && errorText ? (
        <LatoBold style={styles.errorContainer}>{errorText}</LatoBold>
      ) : (
        <View />
      )}
    </View>
  );
};

export const PasswordInput = ({
  id,
  title,
  placeholder,
  error,
  value,
  containerStyle,
  onChangeText,
  match,
  isCheck,
  dispatcher,
  keyboardType,
  disabled,
  minChar,
  maxChar,
  required
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorText, setError] = useState(error);

  const onTextChange = text => {
    let isValid = true;
    setError(null);

    if (match) {
      if (text !== match) {
        isValid = false;
        setError(translate('password_not_match'));
      }
    }

    if (minChar) {
      if (text?.length < minChar) {
        isValid = false;
        setError(translate('password_min', {min: minChar}));
      }
    }

    if (maxChar) {
      console.log(text?.length)
      if (text?.length > maxChar) {
        isValid = false;
        setError(translate('password_max', {max: maxChar}));
      }
    }

    if (text == undefined || text.trim().length <= 0) {
      isValid = false;
      setError(translate('must_not_empty', {s: title}));
    }

    dispatcher({
      id: id,
      input: text,
      type: 'input',
      isValid: isValid,
    });
  };

  useEffect(() => {
    onTextChange(value);
  }, [match]);

  return (
    <View style={containerStyle}>
      <LatoBold style={{fontFamily: 'Lato-Bold'}}>
        {title}{required && <LatoBold style={{color: 'red' }}>*</LatoBold>}
      </LatoBold>
      <View style={styles.pickerContainer}>
        <TextInput
          ref={ref =>
            ref &&
            ref.setNativeProps({
              style: {fontFamily: 'Lato-Regular'},
            })
          }
          value={value}
          onChangeText={onTextChange}
          placeholder={placeholder}
          secureTextEntry={!passwordVisible}
          keyboardType={keyboardType ?? 'default'}
          containerStyle={{margin: 0, borderWidth: 1}}
          style={[styles.textInputStyle, {borderBottomWidth: 0}]}
          inputStyle={[styles.textInputInputStyle, {borderBottomWidth: 0}]}
        />
        {!passwordVisible ? (
          <PasswordHide onPress={() => setPasswordVisible(!passwordVisible)} />
        ) : (
          <PasswordUnhide
            onPress={() => setPasswordVisible(!passwordVisible)}
          />
        )}
      </View>

      {isCheck && errorText ? (
        <LatoBold style={styles.errorContainer}>{errorText}</LatoBold>
      ) : (
        <View />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  countryContainer: {
    borderBottomColor: 'gray',
    paddingVertical: 5,
    paddingRight: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingRight: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    color: 'red',
    marginTop: 5,
  },
  counter: {
    fontSize: 10,
    marginTop: 5,
  },
  textInputStyle: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 5 : 0,
    paddingLeft: 0,
    fontFamily: 'Lato-Regular',
    color: Colors.primaryText,
  },
  textInputInputStyle: {
    margin: 0,
    borderColor: 'black',
    borderBottomWidth: 1,
    paddingLeft: 0,
    fontFamily: 'Lato-Regular',
  },
});

export const MemberInput = ({
  id,
  nameTitle,
  namePlaceholder,
  nameValue,
  nrpTitle,
  nrpPlaceholder,
  nrpValue,
  containerStyle,
  onChangeText,
  isCheck,
  dispatcher,
  maxChar,
  multiline,
  keyboardType,
  bindValue,
  index,
  required,
}) => {
  const [nameErrorText, setErrorName] = useState('');
  const [nrpErrorText, setErrorNrp] = useState('');

  const onTextChange = (id, text) => {
    let isValid = true;
    setErrorName(null);
    setErrorNrp(null);

    if (required) {
      if (nrpValue == '') {
        isValid = false;
        setErrorNrp(translate('must_not_empty', {s: nrpTitle}));
      }
      if (nameValue == '') {
        isValid = false;
        setErrorName(translate('must_not_empty', {s: nameTitle}));
      }
    } else {
      if (nameValue != '' && nrpValue == '') {
        isValid = false;
        setErrorNrp(translate('must_not_empty', {s: nrpTitle}));
      }
      if (nameValue == '' && nrpValue != '') {
        isValid = false;
        setErrorName(translate('must_not_empty', {s: nameTitle}));
      }
    }

    var data = [];
    var formatted = '';
    if (id == 'nrp') {
      formatted = text.replace(/[^0-9]/g, '');
    } else {
      formatted = text;
    }

    if (id == 'name') {
      data = {
        name: formatted,
        nrp: nrpValue,
        is_leader: required ? 1 : 0,
      };
    } else {
      data = {
        name: nameValue,
        nrp: formatted,
        is_leader: required ? 1 : 0,
      };
    }

    dispatcher({
      input: data,
      type: 'input',
      isValid: isValid,
      index: index,
    });
  };

  useEffect(() => {
    onTextChange('name', nameValue);
    onTextChange('nrp', nrpValue);
  }, [nameValue, nrpValue]);

  return (
    <View style={containerStyle}>
      <LatoBold style={{fontWeight: '700'}}>{nameTitle}</LatoBold>
      <TextInput
        value={nameValue}
        onChangeText={text => onTextChange('name', text)}
        placeholder={namePlaceholder}
        multiline={multiline}
        keyboardType={keyboardType ?? 'default'}
        containerStyle={{margin: 0, borderWidth: 1}}
        style={styles.textInputStyle}
        inputStyle={styles.textInputInputStyle}
      />
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        {isCheck && nameErrorText ? (
          <LatoBold style={styles.errorContainer}>{nameErrorText}</LatoBold>
        ) : (
          <View />
        )}
        {/* {maxChar ? (
          <LatoBold
            style={styles.counter}>{`${value.length}/${maxChar}`}</LatoBold>
        ) : (
          <View />
        )} */}
      </View>
      <LatoBold style={{fontWeight: '700', marginTop: 16}}>
        {nrpTitle}
      </LatoBold>
      <TextInput
        value={nrpValue}
        onChangeText={text => onTextChange('nrp', text)}
        placeholder={nrpPlaceholder}
        multiline={multiline}
        keyboardType={keyboardType ?? 'number-pad'}
        containerStyle={{margin: 0, borderWidth: 1}}
        style={styles.textInputStyle}
        inputStyle={styles.textInputInputStyle}
      />
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        {isCheck && nrpErrorText ? (
          <LatoBold style={styles.errorContainer}>{nrpErrorText}</LatoBold>
        ) : (
          <View />
        )}
        {/* {maxChar ? (
          <LatoBold
            style={styles.counter}>{`${value.length}/${maxChar}`}</LatoBold>
        ) : (
          <View />
        )} */}
      </View>
    </View>
  );
};

export default CustomInput;
