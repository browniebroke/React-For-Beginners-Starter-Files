import React from 'react';

import Header from './Header';
import Order from './Order';
import Inventory from "./Inventory";
import fishSamples from '../sample-fishes';
import Fish from "./Fish";
import base from "../base";

class App extends React.Component {
  constructor() {
    super();
    this.addFish = this.addFish.bind(this);
    this.loadSamples = this.loadSamples.bind(this);
    this.addToOrder = this.addToOrder.bind(this);
    // initial state
    this.state = {
      fishes: {},
      order: {},
    }
  }

  componentWillMount() {
    // Runs right before <App> is rendered
    this.ref = base.syncState(`${this.props.params.storeId}/fishes`, {
      context: this,
      state: 'fishes'
    });

    // Grab order from local storage
    const orderRef = localStorage.getItem(`order-${this.props.params.storeId}`);
    if (orderRef) {
      this.setState({
        order: JSON.parse(orderRef)
      })
    }
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
  }

  addFish(fish) {
    // Copy existing state
    const fishes = {...this.state.fishes};
    // Update it
    const timestamp = Date.now();
    fishes[`fish-${timestamp}`] = fish;
    // Set the new state
    this.setState({fishes});
  }

  loadSamples() {
    this.setState({fishes: fishSamples});
  }

  addToOrder(key) {
    // Copy state
    const order = {...this.state.order};
    // Update key
    order[key] = order[key] + 1 || 1;
    // Set State
    this.setState({order})
  }

  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="The freshest fishes in the area"/>
          <ul className="list-of-fishes">
            {
              Object
                .keys(this.state.fishes)
                .map(key => <Fish key={key}
                                  index={key}
                                  details={this.state.fishes[key]}
                                  addToOrder={this.addToOrder}/>)
            }
          </ul>
        </div>
        <Order
          fishes={this.state.fishes}
          order={this.state.order}
          params={this.props.params}
        />
        <Inventory addFish={this.addFish} loadSamples={this.loadSamples}/>
      </div>
    )
  }
}

export default App;
