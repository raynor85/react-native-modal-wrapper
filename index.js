'use strict';

import React, { Component } from 'react';
import { Animated, Dimensions, Modal, Platform, TouchableWithoutFeedback, StyleSheet, View } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';

export default class ModalWrapper extends Component {
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
      currentPosition: new Animated.Value(this.getInitialPosition()),
      isAnimating: false,
      overlayOpacity: new Animated.Value(0)
    };
  }

  getOverlayOpacity = () => {
    const { overlayStyle: { opacity } = {} } = this.props;
    return opacity === 0 || opacity > 0 ? opacity : 0.5;
  }

  componentDidMount() {
    const { animateOnMount, visible } = this.props;

    if (visible) {
      if (animateOnMount) {
        this.animateOpen();
      } else {
        this.setState({
          currentPosition: new Animated.Value(0),
          isAnimating: false,
          overlayOpacity: new Animated.Value(this.getOverlayOpacity())
        });
      }
    }
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
    const { animationDuration } = this.props;

    Animated.timing(
      this.state.overlayOpacity, {
        toValue: this.getOverlayOpacity(),
        duration: animationDuration
      }
    ).start();
    Animated.timing(
      this.state.currentPosition, {
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
      this.state.currentPosition, {
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
    const { children, containerStyle, isNative, overlayStyle, style, visible, ...modalProps } = this.props;
    const { currentPosition, overlayOpacity } = this.state;
    const modalStyle = [
      styles.modal,
      style,
      { transform: this.isVertical ? [{ translateY: currentPosition }] : [{ translateX: currentPosition }] }
    ];
    const content = <View style={[styles.container, containerStyle]}>
      <TouchableWithoutFeedback style={styles.overlayWrapper} onPress={this.animateClose}>
          <Animated.View style={[styles.overlay, overlayStyle, { opacity: overlayOpacity }]} />
      </TouchableWithoutFeedback>
      <Animated.View style={modalStyle}>
        {children}
      </Animated.View>
    </View>;
    const keyboardSpacer = Platform.OS === 'ios' && <KeyboardSpacer />;

    return (
      isNative ? <Modal
          visible={visible}
          {...modalProps}>
        {content}
        {keyboardSpacer}
      </Modal> : visible ? <View
          style={styles.overlayWrapper}>
        {content}
        {keyboardSpacer}
      </View> : null
    );
  }
}

ModalWrapper.propTypes = {
  animateOnMount: React.PropTypes.bool,
  animationDuration: React.PropTypes.number,
  containerStyle: React.PropTypes.object,
  isNative: React.PropTypes.bool,
  overlayStyle: React.PropTypes.object,
  position: React.PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  visible: React.PropTypes.bool.isRequired
};

ModalWrapper.defaultProps = {
  animateOnMount: false,
  animationDuration: 300,
  animationType: 'none',
  isNative: true,
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
