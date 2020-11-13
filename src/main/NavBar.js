import React, { Component } from "react";
import PropTypes from 'prop-types';


export default class NavBar extends Component {
  render() {
    const nav_items = this.props.items.map((item, index) => {
      let className = "nav-item";
      let onClick = undefined;
      if (index === this.props.active) {
        className += " active";
      } else {
        onClick = () => this.props.onClick(index);
      }

      return (
        <div className={className} key={item.id} onClick={onClick}>
          <div className="nav-item__icon">
            <i className={"fas fa-" + item.icon} />
          </div>
          <div className="nav-item__title">{item.title}</div>
        </div>
      );
    });

    return (
      <div id="NavBar" className="navbar">
        {nav_items}
      </div>
    );
  }
}

NavBar.propTypes = {
  items: PropTypes.array.isRequired,
  active: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired
};
