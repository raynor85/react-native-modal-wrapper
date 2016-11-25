'use strict';

import React, { Component } from 'react';
import { Animated, Dimensions, Modal, Platform, TouchableWithoutFeedback, StyleSheet, View } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';

export default class Dialog extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitState();
    this.isVertical = this.props.position === 'top' || this.props.position === 'bottom';
  }

  getInitialPosition = () => {
    const { width, height } = Dimensions.get('window');
    const { position } = this.props;
    let initialPosition = this.isVertical ? height : width;

    if (position === 'top' || position === 'left') {
      initialPosition = -initialPosition;
    }
    return initialPosition;
  }

  getInitState = () => {
    return {
      overlayOpacity: new Animated.Value(0),
      position: new Animated.Value(this.getInitialPosition()),
      isAnimating: false
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.visible !== this.props.visible) {
      if (newProps.visible) {
        this.animateOpen();
      } else {
        this.props.onRequestClose();
        this.setState(this.getInitState());
      }
    }
  }

  animateOpen = () => {
    const { animationDuration, overlayStyle: { opacity } = {} } = this.props;

    Animated.timing(
      this.state.overlayOpacity, {
        toValue: opacity === 0 || opacity > 0 ? opacity : 0.5,
        duration: animationDuration
      }
    ).start();
    Animated.timing(
      this.state.position, {
        toValue: 0,
        duration: animationDuration
      }
    ).start(() => {
      this.setState({ isAnimating: false });
    });
    this.setState({ isAnimating: true });
  };

  animateClose = () => {
    const { animationDuration, onRequestClose } = this.props;
    const initialPosition = this.getInitialPosition();

    Animated.timing(
      this.state.overlayOpacity, {
        toValue: 0,
        duration: animationDuration
      }
    ).start();
    Animated.timing(
      this.state.position, {
        toValue: initialPosition,
        duration: animationDuration
      }
    ).start(() => {
      this.setState({ isAnimating: false });
      onRequestClose();
    });
    this.setState({ isAnimating: true });
  };

  render() {
    const { children, containerStyle, overlayStyle, style, ...modalProps } = this.props;
    const { overlayOpacity, position } = this.state;
    const modalStyle = [
      styles.modal,
      style,
      { transform: this.isVertical ? [{ translateY: position }] : [{ translateX: position }] }
    ];
    return (
      <Modal
          {...modalProps}>
        <View style={[styles.container, containerStyle]}>
          <TouchableWithoutFeedback style={styles.overlayWrapper} onPress={this.animateClose}>
              <Animated.View style={[styles.overlay, overlayStyle, { opacity: overlayOpacity }]} />
          </TouchableWithoutFeedback>
          <Animated.View style={modalStyle}>
            {children}
          </Animated.View>
        </View>
        {Platform.OS === 'ios' && <KeyboardSpacer />}
      </Modal>
    );
  }
}

Dialog.propTypes = {
  animationDuration: React.PropTypes.number,
  containerStyle: React.PropTypes.object,
  overlayStyle: React.PropTypes.object,
  position: React.PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  visible: React.PropTypes.bool.isRequired
};

Dialog.defaultProps = {
  animationDuration: 300,
  animationType: 'none',
  onRequestClose: () => null,
  position: 'bottom',
  transparent: true
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  modal: {
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  overlay: {
    backgroundColor: '#000',
    position: 'absolute',
    top: -500,
    bottom: -500,
    left: -500,
    right: -500,
    opacity: 0
  },
  overlayWrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
});
