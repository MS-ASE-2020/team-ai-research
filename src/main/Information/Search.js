import React, { Component } from "react";
import PropTypes from "prop-types";

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
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { deepOrange } from "@material-ui/core/colors";
import Box from '@material-ui/core/Box';
import { htmlEscape } from 'main/utils';


const theme = createMuiTheme({
  palette: {
    primary: deepOrange,
  },
});

function searchResultSanitizer(str) {
  str = htmlEscape(str);
  str = str.replace("&lt;b&gt;", "<b>").replace("&lt;/b&gt;", "</b>");
  return str;
}

function SearchBy(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <span style={{ margin: "10px" }}>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        endIcon={<ArrowDropDownIcon />}
        variant="outlined"
      >
        By
      </Button>
      <ThemeProvider theme={theme}>
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
                  color="primary"
                  size="small"
                  defaultChecked={props.searchBy.pName}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              }
              label="Name"
            />
          </MenuItem>
          <Divider />
          <MenuItem>
            <FormControlLabel
              control={
                <Checkbox
                  name="pTitle"
                  onChange={props.handleSearchBy}
                  color="primary"
                  size="small"
                  defaultChecked={props.searchBy.pTitle}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              }
              label="Title"
            />
          </MenuItem>
          <Divider />
          <MenuItem>
            <FormControlLabel
              control={
                <Checkbox
                  name="pKeywords"
                  onChange={props.handleSearchBy}
                  color="primary"
                  size="small"
                  defaultChecked={props.searchBy.pKeywords}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              }
              label="Keywords"
            />
          </MenuItem>
          <Divider />
          <MenuItem>
            <FormControlLabel
              control={
                <Checkbox
                  name="pYear"
                  onChange={props.handleSearchBy}
                  color="primary"
                  size="small"
                  defaultChecked={props.searchBy.pYear}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              }
              label="Year"
            />
          </MenuItem>
          <Divider />
          <MenuItem>
            <FormControlLabel
              control={
                <Checkbox
                  name="pConference"
                  onChange={props.handleSearchBy}
                  color="primary"
                  size="small"
                  defaultChecked={props.searchBy.pConference}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              }
              label="Conference"
            />
          </MenuItem>
          <Divider />
          <MenuItem>
            <FormControlLabel
              control={
                <Checkbox
                  name="pQandA"
                  onChange={props.handleSearchBy}
                  color="primary"
                  size="small"
                  defaultChecked={props.searchBy.pQandA}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              }
              label="Q and A"
            />
          </MenuItem>
          <Divider />
          <MenuItem>
            <FormControlLabel
              control={
                <Checkbox
                  name="pAnnotations"
                  onChange={props.handleSearchBy}
                  color="primary"
                  size="small"
                  defaultChecked={props.searchBy.pAnnotations}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              }
              label="Annotations"
            />
          </MenuItem>
          <Divider />
          <MenuItem>
            <FormControlLabel
              control={
                <Checkbox
                  name="pContent"
                  onChange={props.handleSearchBy}
                  color="primary"
                  size="small"
                  defaultChecked={props.searchBy.pContent}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              }
              label="Content"
            />
          </MenuItem>
          <Divider />
          <MenuItem>
            <FormControlLabel
              control={
                <Checkbox
                  name="fPath"
                  onChange={props.handleSearchBy}
                  color="primary"
                  size="small"
                  defaultChecked={props.searchBy.fPath}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              }
              label="Folder Path"
            />
          </MenuItem>
          <Divider />
          <MenuItem>
            <FormControlLabel
              control={
                <Checkbox
                  name="fDescription"
                  onChange={props.handleSearchBy}
                  color="primary"
                  size="small"
                  defaultChecked={props.searchBy.fDescription}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              }
              label="Folder Description"
            />
          </MenuItem>
        </Menu>
      </ThemeProvider>
    </span>
  );
}

SearchBy.propTypes = {
  searchBy: PropTypes.object.isRequired,
  handleSearchBy: PropTypes.func.isRequired,
};

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
        <ThemeProvider theme={theme} key={k}>
          <Accordion square>
            <AccordionSummary
              aria-controls="panel1d-content"
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography>
                <IconButton
                  size="small"
                  onClick={(event) => {
                    event.stopPropagation();
                    this.props.openFile("paper://" + this.state.searchItem[k].ID);
                  }}>
                  <SendIcon
                    fontSize="inherit"
                    color="primary" />
                </IconButton>
                {this.state.searchItem[k].name}
              </Typography>
            </AccordionSummary>
            <Divider />
            <AccordionDetails>
              <div dangerouslySetInnerHTML={{ __html: searchResultSanitizer(this.state.searchItem[k].matcher) }} />
            </AccordionDetails>
          </Accordion>
        </ThemeProvider>
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
        <form style={{
          display: "flex",
          alignItems: "center"
        }}>
          <ThemeProvider theme={theme}>
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              color="primary"
              onKeyDown={(event) => {
                if (event.keyCode === 13) {
                  this.SubmitSearch();
                }
              }}
              onChange={this.handleTextChange.bind(this)}
              style={{ verticalAlign: "center" }}
              fullWidth={true}
            />
            <SearchBy
              searchBy={this.state.searchBy}
              handleSearchBy={this.handleSearchBy.bind(this)} />
            <FormControlLabel
              control={
                <Checkbox
                  onChange={() => this.setState({
                    recursive: !this.state.recursive
                  })}
                  size="small"
                  color="primary"
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              }
              label="Recursive:"
              labelPlacement="start"
            />
            <Box pl="1rem" pr="1rem">
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<SearchIcon />}
                onClick={() => this.SubmitSearch()}
              >Search</Button>
            </Box>
          </ThemeProvider>
        </form>
        <Box pt="1rem" pb="1rem">
          <Divider />
        </Box>
        <div>
          {searchResult}
        </div>
      </div>
    );
  }
}

Search.propTypes = {
  folderID: PropTypes.number.isRequired,
  clearInfoZone: PropTypes.func.isRequired,
  openFile: PropTypes.func.isRequired
};
