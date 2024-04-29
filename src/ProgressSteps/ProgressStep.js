import React, { Component, useContext } from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import PropTypes, { number } from 'prop-types';

import ProgressButtons from './ProgressButtons';
import ProgressContext from './ProgressContext';

const ProgressStep = (props) => {
  const context = useContext(ProgressContext);

  const onNextStep = async () => {
    console.log(props.onNext);
    console.log(context.activeStep);
    props.onNext && (await props.onNext());

    // Return out of method before moving to next step if errors exist.
    if (props.errors) {
      return;
    }

    context.setActiveStep(context.activeStep + 1);
  };

  const onPreviousStep = () => {
    // Changes active index and calls previous function passed by parent
    props.onPrevious && props.onPrevious();
    context.setActiveStep(context.activeStep - 1);
  };

  const onSubmit = () => {
    props.onSubmit && props.onSubmit();
  };

  const renderNextButton = () => {
    const btnStyle = {
      textAlign: 'center',
      padding: 8,
      ...props.nextBtnStyle
    };

    const btnTextStyle = {
      color: '#007AFF',
      fontSize: 18,
      ...props.nextBtnTextStyle
    };

    const disabledBtnText = {
      color: '#cdcdcd'
    };

    let textStyle = [btnTextStyle];
    if (props.nextBtnDisabled) textStyle.push(disabledBtnText);

    return (
      <TouchableOpacity
        style={btnStyle}
        onPress={context.activeStep === context.stepCount - 1 ? onSubmit : onNextStep}
        disabled={props.nextBtnDisabled}
      >
        <Text style={textStyle}>
          {context.activeStep === context.stepCount - 1 ? props.finishBtnText : props.nextBtnText}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderPreviousButton = () => {
    const btnStyle = {
      textAlign: 'center',
      padding: 8,
      ...props.previousBtnStyle
    };

    const btnTextStyle = {
      color: '#007AFF',
      fontSize: 18,
      ...props.previousBtnTextStyle
    };

    const disabledBtnText = {
      color: '#cdcdcd'
    };

    let textStyle = [btnTextStyle];
    if (props.previousBtnDisabled) textStyle.push(disabledBtnText);

    return (
      <TouchableOpacity style={btnStyle} onPress={onPreviousStep} disabled={props.previousBtnDisabled}>
        <Text style={textStyle}>{context.activeStep === 0 ? '' : props.previousBtnText}</Text>
      </TouchableOpacity>
    );
  };

  const scrollViewProps = props.scrollViewProps || {};
  const viewProps = props.viewProps || {};
  const isScrollable = props.scrollable;
  const buttonRow = props.removeBtnRow ? null : (
    <ProgressButtons 
      renderNextButton={renderNextButton} 
      renderPreviousButton={renderPreviousButton} 
    />
  );

  return (
    <React.Fragment>
      {
        context.activeStep === (props.step - 1) &&
        <View style={{ flex: 1 }}>
          {isScrollable
            ? <ScrollView {...scrollViewProps}>{props.children}</ScrollView>
            : <View {...viewProps}>{props.children}</View>}
  
          {buttonRow}
        </View>
      }
    </React.Fragment>
  );
}

ProgressStep.propTypes = {
  label: PropTypes.string,
  onNext: PropTypes.func,
  onPrevious: PropTypes.func,
  onSubmit: PropTypes.func,
  nextBtnText: PropTypes.string,
  previousBtnText: PropTypes.string,
  finishBtnText: PropTypes.string,
  nextBtnStyle: PropTypes.object,
  nextBtnTextStyle: PropTypes.object,
  nextBtnDisabled: PropTypes.bool,
  previousBtnStyle: PropTypes.object,
  previousBtnTextStyle: PropTypes.object,
  previousBtnDisabled: PropTypes.bool,
  scrollViewProps: PropTypes.object,
  viewProps: PropTypes.object,
  errors: PropTypes.bool,
  removeBtnRow: PropTypes.bool,
  scrollable: PropTypes.bool,
  step: number
};

ProgressStep.defaultProps = {
  nextBtnText: 'Next',
  previousBtnText: 'Previous',
  finishBtnText: 'Submit',
  nextBtnDisabled: false,
  previousBtnDisabled: false,
  errors: false,
  removeBtnRow: false,
  scrollable: true
};

export default ProgressStep;
