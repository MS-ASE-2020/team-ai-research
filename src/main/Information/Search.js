/* eslint-disable react/prop-types */
import React, { Component } from "react";

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

function SearchBy(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <span>
      <Button 
        aria-controls="simple-menu" 
        aria-haspopup="true" 
        onClick={handleClick}
        endIcon={<ArrowDropDownIcon />}
        variant="outlined"
      >
        By
      </Button>
      <Menu
        id="simple-menu"
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem>
          <FormControlLabel
            control={
              <Checkbox
                name="pName" 
                onChange={props.handleSearchBy} 
                size="small"
                defaultChecked={props.searchBy.pName}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            }
            label="Name"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Checkbox 
                name="pTitle" 
                onChange={props.handleSearchBy} 
                size="small"
                defaultChecked={props.searchBy.pTitle}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            }
            label="Title"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Checkbox 
                name="pKeywords" 
                onChange={props.handleSearchBy} 
                size="small"
                defaultChecked={props.searchBy.pKeywords}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            }
            label="Keywords"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Checkbox 
                name="pYear" 
                onChange={props.handleSearchBy} 
                size="small"
                defaultChecked={props.searchBy.pYear}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            }
            label="Year"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Checkbox 
                name="pConference" 
                onChange={props.handleSearchBy} 
                size="small"
                defaultChecked={props.searchBy.pConference}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            }
            label="Conference"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Checkbox 
                name="pQandA" 
                onChange={props.handleSearchBy} 
                size="small"
                defaultChecked={props.searchBy.pQandA}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            }
            label="Q and A"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Checkbox 
                name="pAnnotations" 
                onChange={props.handleSearchBy} 
                size="small"
                defaultChecked={props.searchBy.pAnnotations}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            }
            label="Annotations"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Checkbox 
                name="pContent" 
                onChange={props.handleSearchBy} 
                size="small"
                defaultChecked={props.searchBy.pContent}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            }
            label="Content"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Checkbox 
                name="fPath" 
                onChange={props.handleSearchBy} 
                size="small"
                defaultChecked={props.searchBy.fPath}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            }
            label="Folder Path"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Checkbox 
                name="fDescription" 
                onChange={props.handleSearchBy} 
                size="small"
                defaultChecked={props.searchBy.fDescription}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            }
            label="Folder Description"
          />
        </MenuItem>
      </Menu>
    </span>
  );
} 

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
          style={{width: "880px"}}>
          <AccordionSummary 
            aria-controls="panel1d-content" 
            id="panel1d-header"
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>
              <IconButton 
                size="small"
                onClick={(event) => {
                  event.stopPropagation();
                  alert(JSON.stringify(this.state.searchItem[k].ID));
                }}>
                <SendIcon fontSize="inherit"/>
              </IconButton> &nbsp;
              {this.state.searchItem[k].name}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="textSecondary">
              <div dangerouslySetInnerHTML={{ __html: this.state.searchItem[k].matcher }} />
            </Typography>
          </AccordionDetails>
        </Accordion>
      );
    }
    if (this.state.searchItem.length === 0) {
      searchResult.push(
        <div key={-1}>
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
              width: "600px"
            }}
            onChange={this.handleTextChange.bind(this)}
          /> &nbsp;
          <SearchBy 
            searchBy={this.state.searchBy}
            handleSearchBy={this.handleSearchBy.bind(this)}/>
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
        <br/>
        <div>
          {searchResult}
        </div> 
      </div>
    );
  }
}

