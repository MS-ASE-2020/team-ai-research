import React, { Component } from "react";

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Radio from '@material-ui/core/Radio';
import Checkbox from '@material-ui/core/Checkbox';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import { Check } from "@material-ui/icons";

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      searchBy: {
        pName: true,
        pTitle: true,
        pKeywords: true,
        pYear: true,
        pConference: true,
        pLastedit: true,
        pQandA: true,
        pAnnotations: true,
        pContent: true,
        fPath: true,
        fDescription: true,
        fCreatetime: true,
      },
      recursive: false,
      searchItem: []
    };
  }

  handleTextChange(event) {
    const value = event.target.value;
    this.setState({
      text: value
    });
  }

  handleSearchBy(event) {
    const name = event.target.name;
    let searchBy = JSON.parse(JSON.stringify(this.state.searchBy));
    searchBy[[name]] = !this.state.searchBy[[name]];
    this.setState({
      searchBy: searchBy
    });
  }

  SubmitSearch() {
    let searchItem = window.api.database.searchPaperInFolder(
      window.db,
      this.props.folderID,
      this.state.searchBy,
      this.state.text,
      this.state.recursive
    );
    this.setState({
      searchItem: searchItem
    });
  }

  render() {
    let searchResult = [];
    for (let k = 0; k < this.state.searchItem.length; k++) {
      searchResult.push(
        <Accordion 
          square
          key={k}
          style={{width: "800px"}}>
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography>{this.state.searchItem[k].name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="textSecondary">
              {this.state.searchItem[k].matcher}
            </Typography>
          </AccordionDetails>
        </Accordion>
      );
    }
    if (this.state.searchItem.length === 0) {
      searchResult.push(
        <div>
          No matched results.
        </div>
      );
    }
    return (
      <div>
        <div>
          <TextField 
            label="Search" 
            variant="outlined"
            size="small"
            style={{
              width: "550px"
            }}
            onChange={this.handleTextChange.bind(this)}
          />
          <FormControlLabel
            control={
              <Checkbox
                onChange={() => this.setState({
                  recursive: !this.state.recursive
                })}
                size="small"
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            }
            label="Recursive:"
            labelPlacement="start"
          /> &nbsp; &nbsp;
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<SearchIcon />}
            onClick={() => this.SubmitSearch()}
          >Search</Button>
        </div>
        <br/>
        <Divider />
        <div>
          <FormLabel component="legend">Search By Paper Information: </FormLabel>
          <div>
            <FormControlLabel
              control={
                <Checkbox
                  name="pName" 
                  onChange={this.handleSearchBy.bind(this)} 
                  size="small"
                  defaultChecked
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              }
              label="Name"
            />
            <FormControlLabel
              control={
                <Checkbox 
                  name="pTitle" 
                  onChange={this.handleSearchBy.bind(this)} 
                  size="small"
                  defaultChecked
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              }
              label="Title"
            />
            <FormControlLabel
              control={
                <Checkbox 
                  name="pKeywords" 
                  onChange={this.handleSearchBy.bind(this)} 
                  size="small"
                  defaultChecked
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              }
              label="Keywords"
            />
            <FormControlLabel
              control={
                <Checkbox 
                  name="pYear" 
                  onChange={this.handleSearchBy.bind(this)} 
                  size="small"
                  defaultChecked
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              }
              label="Year"
            />
            <FormControlLabel
              control={
                <Checkbox 
                  name="pConference" 
                  onChange={this.handleSearchBy.bind(this)} 
                  size="small"
                  defaultChecked
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              }
              label="Conference"
            />
            <FormControlLabel
              control={
                <Checkbox 
                  name="pQandA" 
                  onChange={this.handleSearchBy.bind(this)} 
                  size="small"
                  defaultChecked
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              }
              label="Q&A"
            />
            <FormControlLabel
              control={
                <Checkbox 
                  name="pAnnotations" 
                  onChange={this.handleSearchBy.bind(this)} 
                  size="small"
                  defaultChecked
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              }
              label="Annotations"
            />
            <FormControlLabel
              control={
                <Checkbox 
                  name="pContent" 
                  onChange={this.handleSearchBy.bind(this)} 
                  size="small"
                  defaultChecked
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              }
              label="Content"
            />       
          </div>
          <FormLabel component="legend">Search By Folder Information: </FormLabel>
          <div>
            <FormControlLabel
              control={
                <Checkbox 
                  name="fPath" 
                  onChange={this.handleSearchBy.bind(this)} 
                  size="small"
                  defaultChecked
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              }
              label="Path"
            />
            <FormControlLabel
              control={
                <Checkbox 
                  name="fDescription" 
                  onChange={this.handleSearchBy.bind(this)} 
                  size="small"
                  defaultChecked
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              }
              label="Description"
            />
          </div> 
        </div>
        <Divider />
        <br/>
        <div>
          {searchResult}
        </div> 
      </div>
    );
  }
}

    