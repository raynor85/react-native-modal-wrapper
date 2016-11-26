# react-native-modal-wrapper

Wrapper component that extends the react native Modal component, adding overlay clickable behavior and allowing swipe in and out in all directions

## Install

```
npm install react-native-modal-wrapper --save
```

## Central modal box example

<img src="http://i.imgur.com/b9WqSys.gif" width=300>
```jsx
<Dialog
    isOpen={isOpen}
    onClosed={this.onCancel}
    title="New project"
    style={{ paddingLeft: 24, paddingRight: 24 }}>
  <TextField
      autoFocus={true}
      placeholder="Project name"
      onNameChange={this.onNameChangeHandler}
      onSubmitEditing={this.onSubmit} />
  <View>
    <MDButton text="CANCEL" type="regular" flat={true} onPress={this.onCancel} />
    <MDButton text="CREATE" type="primary" flat={true} onPress={this.onSubmit} />
  </View>
</Dialog>
```
## Bottom contextual menu example

<img src="http://i.imgur.com/D4fZCSY.gif" width=300>
```jsx
<Dialog
    isOpen={isOpen}
	onClosed={onClosed}
	style={{ flex: 1 }}
	containerStyle={{ flexDirection: 'row', alignItems: 'flex-end' }}>
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
</Dialog>
```

## Right contextual menu example

<img src="http://i.imgur.com/2unlOIz.gif" width=600>
```jsx
<Dialog
	containerStyle={{ flexDirection: 'row', justifyContent: 'flex-end' }}
    isOpen={isFilterByTagPanelOpen}
    onClosed={() => this.setState({ isFilterByTagPanelOpen: false })}
    position="right"
    style={{ width: 360 }}>
  <FilterByTag
      onClose={() => this.setState({ isFilterByTagPanelOpen: false })}
      onSelection={tags => updateProjectFilter({ tags })}>
  </FilterByTag>
</Dialog>
```

## Properties

This component supports all the properties of the original react native modal component https://facebook.github.io/react-native/docs/modal.html, plus the following:

| Prop  | Default  | Type | Description |
| :------------ |:---------------:| :---------------:| :-----|
| animationDuration | 300 | `number` | Duration of the animation.  |
| position | bottom | `string` | Position where the sliding animation of the modal should start. Accepted values: "top", "bottom", "left", "right". |
| containerStyle | - | `object` | Container styles used for positioning the modal with flexbox (default: alignItems: 'center', flex: 1, justifyContent: 'center'). See the examples. |
| overlayStyle | - | `object` | Styles used to define the overlay backgroundColor (default: "#000") and opacity (default: 0.5). |
| style | - | `object` | Styles of the modal (default: backgroundColor: '#fff', justifyContent: 'center'). |

Note: this component sets some properties of the underlying native modal component to allow sliding flexibility in each direction and the clickable overlay behavior, therefore we suggest not to change those. However, you can set to 0 the animationDuration prop to avoid the component sliding logic from top, bottom, left or right and therefore turning on the react native modal animationType prop, disabled by default. Here the list of the react native modal properties set by default:

| Prop  | Default  | Type | Description |
| :------------ |:---------------:| :---------------:| :-----|
| animationType |"none" | `string` | The react native modal has limited animation customization, therefore the animation logic is done externally using position and animationDuration.  |
| transparent |true | `bool` | We want to have the overlay by default. |
