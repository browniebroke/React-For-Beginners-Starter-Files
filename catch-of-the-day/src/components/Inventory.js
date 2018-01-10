import React from 'react';
import AddFishForm from './AddFishForm';


class Inventory extends React.Component {
  constructor() {
    super();
    this.renderInventory = this.renderInventory.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e, key) {
    const fish = this.props.fishes[key];
    const updatedFish = {
      ...fish,
      [e.target.name]: e.target.value
    };
    this.props.updateFish(key, updatedFish);
  }


  renderInventory(key) {
    const fish = this.props.fishes[key];
    return (
      <div className="fish-edit" key={key}>
        <input type="text" name="name" value={fish.name} placeholder="Fish name" onChange={(e) => this.handleChange(e, key)}/>
        <input type="text" name="price" value={fish.price} placeholder="Fish price" onChange={(e) => this.handleChange(e, key)}/>
        <select name="status" value={fish.status} onChange={(e) => this.handleChange(e, key)}>
          <option value="available">Fresh</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea name="desc" value={fish.desc} placeholder="Fish desc" onChange={(e) => this.handleChange(e, key)}/>
        <input type="text" value={fish.image} name="image" placeholder="Fish image" onChange={(e) => this.handleChange(e, key)}/>
        <button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
      </div>
    )
  }

  render() {
    return (
      <div>
        <h3>Inventory</h3>
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        <AddFishForm addFish={ this.props.addFish }/>
        <button onClick={ this.props.loadSamples }>Load samples</button>
      </div>
    )
  }
}

export default Inventory;
