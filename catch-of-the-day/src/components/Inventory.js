import React from 'react';
import AddFishForm from './AddFishForm';
import base from '../base';


class Inventory extends React.Component {
  constructor() {
    super();
    this.renderInventory = this.renderInventory.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.authHandler = this.authHandler.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      uid: null,
      owner: null
    }
  }

  componentDidMount() {
    base.onAuth((user) => {
      if(user) {
        this.authHandler(null, { user });
      }
    })
  }

  handleChange(e, key) {
    const fish = this.props.fishes[key];
    const updatedFish = {
      ...fish,
      [e.target.name]: e.target.value
    };
    this.props.updateFish(key, updatedFish);
  }

  authenticate(provider) {
    console.log(`Trying to authenticate with ${provider}`);
    base.authWithOAuthPopup(provider, this.authHandler);
  }

  logout() {
    base.unauth();
    this.setState({ uid: null });
  }

  authHandler(err, authData) {
    if(err) {
      console.error(err);
    }
    console.log(authData);

    // Grab the store info
    const storeRef = base.database().ref(this.props.storeId);

    // Grab the data from the store
    storeRef.once('value', (snapshot) => {
      const data = snapshot.val() || {};

      // Take ownership if no owner
      if(!data.owner) {
        storeRef.set({
          owner: authData.user.uid
        });
      }

      // Set the state locally
      this.setState({
        uid: authData.user.uid,
        owner: data.owner || authData.user.uid
      });
    })
  }

  renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Signin to manage your Store's inventory</p>
        <button className="github" onClick={() => this.authenticate('github')}>Log in with Github</button>
        <button className="facebook" onClick={() => this.authenticate('facebook')}>Log in with Facebook</button>
        <button className="twitter" onClick={() => this.authenticate('twitter')}>Log in with Twitter</button>
      </nav>
    )
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
    const logout = <button onClick={this.logout}>Logout!</button>;
    // Is Logged in?
    if(!this.state.uid) {
      return (
        <div>{this.renderLogin()}</div>
      );
    }
    if(this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry, you don't have access to this</p>
          {logout}
        </div>
      )
    }
    return (
      <div>
        <h3>Inventory</h3>
        {logout}
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        <AddFishForm addFish={ this.props.addFish }/>
        <button onClick={ this.props.loadSamples }>Load samples</button>
      </div>
    )
  }
}

Inventory.propTypes = {
  fishes: React.PropTypes.object.isRequired,
  updateFish: React.PropTypes.func.isRequired,
  removeFish: React.PropTypes.func.isRequired,
  addFish: React.PropTypes.func.isRequired,
  loadSamples: React.PropTypes.func.isRequired,
  storeId: React.PropTypes.string.isRequired
};

export default Inventory;
