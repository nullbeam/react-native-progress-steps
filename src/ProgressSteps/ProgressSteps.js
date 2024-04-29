import React, { Component, useEffect } from 'react';
import { View } from 'react-native';
import { times } from 'lodash';
import PropTypes from 'prop-types';
import StepIcon from './StepIcon';
import ProgressContext from './ProgressContext';

const ProgressSteps = (props) => {
  const [stepCount, setStepCount] = React.useState(0);
  const [activeStep, setActiveStep] = React.useState(0);
  const [labels, setLabels] = React.useState([]);

  useEffect(() => {
    const childLabels = [];
    React.Children.forEach(props.children, (child) => {
      childLabels.push(child.props.label);
    })
    setLabels(childLabels);
    setStepCount(props.stepCount);
  }, [props.children])

  useEffect(() => {
    setActiveStep(props.activeStep);
  }, [props.activeStep])

  const getChildProps = () => {
    return { ...props, stepCount, activeStep };
  }

  renderStepIcons = () => {
    let step = [];

    times(stepCount, (i) => {
      const isCompletedStep = props.isComplete ? true : i < activeStep;
      const isActiveStep = props.isComplete ? false : i === activeStep;

      step.push(
        <View key={i}>
          <View>
            <StepIcon
              {...getChildProps()}
              stepNum={i + 1}
              label={labels[i]}
              isFirstStep={i === 0}
              isLastStep={i === stepCount - 1}
              isCompletedStep={isCompletedStep}
              isActiveStep={isActiveStep}
            />
          </View>
        </View>
      );
    });

    return step;
  };

  // Callback function from ProgressStep that passes current step.
  const onChangeActiveStep = (step) => {
    // Guard against setting current step higher than total step count.
    if (step >= stepCount - 1) {
      setActiveStep(stepCount - 1);
    }

    if (step > -1 && step < stepCount - 1) {
      setActiveStep(step);
    }
  };

  const styles = {
    stepIcons: {
      position: 'relative',
      justifyContent: 'space-evenly',
      alignSelf: 'center',
      flexDirection: 'row',
      top: props.topOffset,
      marginBottom: props.marginBottom,
    },
  };

  return (
    <ProgressContext.Provider value={{setActiveStep: onChangeActiveStep, activeStep: activeStep, stepCount: stepCount}}>
      <View style={{ flex: 1 }}>
        <View style={styles.stepIcons}>{renderStepIcons()}</View> 
        <View style={{ flex: 1 }}>
          {/* {React.cloneElement(this.props.children[this.state.activeStep], {
            setActiveStep: this.setActiveStep,
            activeStep: this.state.activeStep,
            stepCount: this.state.stepCount,
          })} */}
          {props.children}
        </View>
      </View>
    </ProgressContext.Provider>
  );
}

ProgressSteps.propTypes = {
  isComplete: PropTypes.bool,
  activeStep: PropTypes.number,
  topOffset: PropTypes.number,
  marginBottom: PropTypes.number,
};

ProgressSteps.defaultProps = {
  isComplete: false,
  activeStep: 0,
  topOffset: 30,
  marginBottom: 50,
};

export default ProgressSteps;
