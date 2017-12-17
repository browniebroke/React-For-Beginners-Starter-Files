import React from 'react';
import AddFishForm from './AddFishForm';


class Inventory extends React.Component {
  render() {
    return (
      <div>
        <h3>Inventory</h3>
        <AddFishForm addFish={ this.props.addFish }/>
      </div>
    )
  }
}

export default Inventory;
