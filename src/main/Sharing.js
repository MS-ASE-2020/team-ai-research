import React, { Component } from "react";
import useContextMenu from 'contextmenu';
import 'contextmenu/ContextMenu.css';

const menuConfig = {
  'Copy': () => document.execCommand("copy"),
  'Translate': {
    'Microsoft Bing': () => alert("Placeholder for Microsoft Bing!"),
    'Google': () => alert("Placeholder for Google!")
  },
  'Search': {
    'Web': () => alert("Placeholder for Web!"),
    'Wikipedia': () => alert("Placeholder for Wikipedia!"), 
    'Articles': () => alert("Placeholder for Articles!")
  },
};

function ContextMenu() {
  const [contextMenu, useCM] = useContextMenu({ submenuSymbol: 'O' });
  return (<div onContextMenu={useCM(menuConfig)}>ABCDE{contextMenu}</div>);
}

export default class Sharing extends Component {
  render() {
    return (
      <div id="Sharing" className="Sharing">
        Placeholder for Sharing
        <ContextMenu />
      </div>
    );
  }
}
