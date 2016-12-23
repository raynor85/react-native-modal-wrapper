# react-native-modal-wrapper [![npm version](https://badge.fury.io/js/react-native-modal-wrapper.svg)](https://badge.fury.io/js/react-native-modal-wrapper)

Wrapper component that extends the react native Modal component, adding overlay clickable behavior and allowing swipe in and out in all directions

## Install

```
npm install react-native-modal-wrapper --save
```

## Central modal box example

<img src="https://j.gifs.com/1jErAV.gif" width=300>

```jsx
<ModalWrapper
    onRequestClose={this.onCancel}
    style={{ width: 280, height: 180, paddingLeft: 24, paddingRight: 24 }}
    visible={isOpen}>
  <Text>New project</Text>
  <TextField
      autoFocus={true}
      placeholder="Project name"
      onNameChange={this.onNameChangeHandler}
      onSubmitEditing={this.onSubmit} />
  <View>
    <MDButton text="CANCEL" type="regular" flat={true} onPress={this.onCancel} />
    <MDButton text="CREATE" type="primary" flat={true} onPress={this.onSubmit} />
  </View>
</ModalWrapper>
```
## Bottom contextual menu example

<img src="https://j.gifs.com/48VRZn.gif" width=400>

```jsx
<ModalWrapper
    containerStyle={{ flexDirection: 'row', alignItems: 'flex-end' }}
    onRequestClose={onClosed}
    style={{ flex: 1 }}
    visible={isOpen}>
  {this.contextMenuActions.map(([id, text, onPress]) =>
	<MDButtonIcon
	    key={id}
	    name={id}
	    iconStyle={styles.optionText}
	    style={styles.option}
	    onPress={() => {
		  onClosed();
	      onPress();
	    }}>
	  <Text>{text}</Text>
	</MDButtonIcon>
  )}
</ModalWrapper>
```

## Right contextual menu example

<img src="https://j.gifs.com/lOX54g.gif" width=400>

```jsx
<ModalWrapper
    containerStyle={{ flexDirection: 'row', justifyContent: 'flex-end' }}
    onRequestClose={() => this.setState({ isFilterByTagPanelOpen: false })}
    position="right"
    style={styles.sidebar}
    visible={isFilterByTagPanelOpen}>
  <FilterByTag
      onClose={() => this.setState({ isFilterByTagPanelOpen: false })}
      onSelection={tags => updateProjectFilter({ tags })}>
  </FilterByTag>
</ModalWrapper>
```

## Modal without overlay example

<img src="https://j.gifs.com/Y6XqlO.gif" width=400>

```jsx
<View style={styles.container} onLayout={() => this.forceUpdate()}>
  {/* Page Content */}
  <ModalWrapper
      isNative={false}
      onRequestClose={this.onRequestClose}
      position='left'
      shouldAnimateOnRequestClose={true}
      showOverlay={false}
      style={[styles.modalStyle, (() => {
        const { height, width } = Dimensions.get('window');
        const modalHeight = 100;
        const modalWidth = 280;
        return {
          top: (height - modalHeight) / 2,
          left: (width - modalWidth) / 2
        };
      })()]}
      visible={this.state.visible}>
    <View style={styles.container}>
      <Text style={styles.modalText}>Modal without overlay</Text>
    </View>
  </ModalWrapper>
</View>
```

## Properties

This component supports all the properties of the original react native modal component https://facebook.github.io/react-native/docs/modal.html, plus the following:

| Prop  | Default  | Type | Description |
| :------------ |:---------------:| :---------------:| :-----|
| animateOnMount | false | `bool` | Determine whether or not animate the modal if it's visible when it mounts. |
| animationDuration | 300 | `number` | Duration of the animation. |
| position | bottom | `string` | Position where the sliding animation of the modal should start. Accepted values: "top", "bottom", "left", "right". |
| containerStyle | - | `object` | Container styles used for positioning the modal with flexbox (default: alignItems: 'center', flex: 1, justifyContent: 'center'). See the examples. |
| isNative | true | `bool` | Determine the usage of the react native modal component or a simple view wrapper instead. It can be set to false to overcome some react native modal limitations (for example to have more than one modal open at the same time). |
| onAnimateClose | () => null | `func` | Callback executed after the modal is closed. |
| onAnimateOpen | () => null | `func` | Callback executed after the modal is open. |
| overlayStyle | - | `object` | Styles used to define the overlay backgroundColor (default: "#000") and opacity (default: 0.5). |
| shouldAnimateOnOverlayPress | true | `bool` | Determine whether or not animate the modal closing down when the overlay is pressed. |
| shouldAnimateOnRequestClose | false | `bool` | Determine whether or not animate the modal closing down when the onRequestClose callback is executed. |
| shouldCloseOnOverlayPress | true | `bool` | Determine whether or not allow the modal closing down if the overlay is pressed. |
| showOverlay | true | `bool` | Determine whether or not showing the overlay. In combination with isNative={false} it is possible to interact with the background of the application when the modal is still open. |
| style | - | `object` | Styles of the modal (default: backgroundColor: '#fff', justifyContent: 'center'). |

Note: this component sets some properties of the underlying native modal component to allow sliding flexibility in each direction and the clickable overlay behavior, therefore we suggest not to change those. However, you can set to 0 the animationDuration prop to avoid the component sliding logic from top, bottom, left or right and therefore turning on the react native modal animationType prop, disabled by default. Here the list of the react native modal properties set by default:

| Prop  | Default  | Type | Description |
| :------------ |:---------------:| :---------------:| :-----|
| animationType | "none" | `string` | The react native modal has limited animation customization, therefore the animation logic is done externally using position and animationDuration.  |
| transparent | true | `bool` | We want to have the overlay by default. |
