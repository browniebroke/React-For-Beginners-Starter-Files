import React from 'react';
import {getFunName} from "../helpers";

class StorePicker extends React.Component {
  goToStore(event) {
    event.preventDefault();
    console.log("You changed the URL");
    // Grab the store name
    let storeId = this.storeInput.value;
    console.log(`Going to ${storeId}`);
    // Go to it
    this.context.router.transitionTo(`/store/${storeId}`);
  }

  render() {
    return (
      <form className="store-selector" onSubmit={this.goToStore.bind(this)}>
        <h2>Please enter a store</h2>
        <input type="text" required placeholder="Store Name" defaultValue={getFunName()} ref={
          (input) => {this.storeInput = input}
        }/>
        <button type="submit">Visit Store</button>
      </form>
    )
  }
}

StorePicker.contextTypes = {
  router: React.PropTypes.object
};

export default StorePicker;
