'use strict';

import React, { Component } from 'react';
import { Animated, Dimensions, Modal, Platform, TouchableWithoutFeedback, StyleSheet, View } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';

export default class ModalWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitState();
  }

  isVertical = () => {
    return this.props.position === 'top' || this.props.position === 'bottom';
  }

  getInitialPosition = () => {
    const { width, height } = Dimensions.get('window');
    const { position } = this.props;
    let initialPosition = this.isVertical() ? height : width;

    if (position === 'top' || position === 'left') {
      initialPosition = -initialPosition;
    }
    return initialPosition;
  }

  getInitState = () => {
    this.isClosingFromOverlayPress = false;
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
    const { animateOnMount, onAnimateOpen, visible } = this.props;

    if (visible) {
      if (animateOnMount) {
        this.animateOpen();
      } else {
        this.setState({
          currentPosition: new Animated.Value(0),
          isAnimating: false,
          overlayOpacity: new Animated.Value(this.getOverlayOpacity())
        });
        onAnimateOpen();
      }
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.visible !== this.props.visible) {
      if (newProps.visible) {
        this.animateOpen();
      } else {
        const { onAnimateClose, onRequestClose, shouldAnimateOnOverlayPress, shouldAnimateOnRequestClose } = newProps;
        const handleClose = (shouldAnimate) => {
          if (shouldAnimate) {
            this.animateClose();
          } else {
            this.setState(this.getInitState());
            onRequestClose();
            onAnimateClose();
          }
        };

        if (this.isClosingFromOverlayPress) {
          handleClose(shouldAnimateOnOverlayPress);
        } else {
          handleClose(shouldAnimateOnRequestClose);
        }
      }
    }
  }

  animateOpen = () => {
    const { animationDuration, onAnimateOpen } = this.props;

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
      onAnimateOpen();
    });
    this.setState({ isAnimating: true });
  };

  animateClose = () => {
    const { animationDuration, onAnimateClose } = this.props;
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
      this.isClosingFromOverlayPress = false;
      this.setState({ isAnimating: false });
      onAnimateClose();
    });
    this.setState({ isAnimating: true });
  };

  onOverlayPress = () => {
    if (this.state.isAnimating) {
      return;
    }
    const { onRequestClose, shouldCloseOnOverlayPress } = this.props;

    if (shouldCloseOnOverlayPress) {
      this.isClosingFromOverlayPress = true;
      onRequestClose();
    }
  }

  render() {
    const { children, containerStyle, isNative, overlayStyle, style, visible, ...modalProps } = this.props;
    const { currentPosition, isAnimating, overlayOpacity } = this.state;
    const isVisible = visible || isAnimating;
    const modalStyle = [
      styles.modal,
      style,
      { transform: this.isVertical() ? [{ translateY: currentPosition }] : [{ translateX: currentPosition }] }
    ];
    const content = <View style={[styles.container, containerStyle]}>
      <TouchableWithoutFeedback style={styles.overlayWrapper} onPress={this.onOverlayPress}>
          <Animated.View style={[styles.overlay, overlayStyle, { opacity: overlayOpacity }]} />
      </TouchableWithoutFeedback>
      <Animated.View style={modalStyle}>
        {children}
      </Animated.View>
    </View>;
    const keyboardSpacer = Platform.OS === 'ios' && <KeyboardSpacer />;
    const nativeModal = <Modal
        visible={isVisible}
        {...modalProps}>
      {content}
      {keyboardSpacer}
    </Modal>;
    const jsModal = isVisible ? <View
        style={styles.overlayWrapper}>
      {content}
      {keyboardSpacer}
    </View> : null;

    return isNative ? nativeModal : jsModal;
  }
}

ModalWrapper.propTypes = {
  animateOnMount: React.PropTypes.bool,
  animationDuration: React.PropTypes.number,
  containerStyle: React.PropTypes.object,
  isNative: React.PropTypes.bool,
  onAnimateClose: React.PropTypes.func,
  onAnimateOpen: React.PropTypes.func,
  overlayStyle: React.PropTypes.object,
  position: React.PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  shouldAnimateOnOverlayPress: React.PropTypes.bool,
  shouldAnimateOnRequestClose: React.PropTypes.bool,
  shouldCloseOnOverlayPress: React.PropTypes.bool,
  visible: React.PropTypes.bool.isRequired
};

ModalWrapper.defaultProps = {
  animateOnMount: false,
  animationDuration: 300,
  animationType: 'none',
  isNative: true,
  onAnimateClose: () => null,
  onAnimateOpen: () => null,
  onRequestClose: () => null,
  position: 'bottom',
  shouldAnimateOnOverlayPress: true,
  shouldAnimateOnRequestClose: false,
  shouldCloseOnOverlayPress: true,
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
