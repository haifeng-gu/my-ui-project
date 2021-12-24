import React from 'react';
import URLSearchParams from 'url-search-params';
import { Route } from 'react-router-dom';
import { Panel } from 'react-bootstrap';

import IssueFilter from './IssueFilter.jsx';
import IssueTable from './IssueTable.jsx';
import IssueDetail from './IssueDetail.jsx';
//import graphQLFetch from './graphQLFetch.js';
import Toast from './Toast.jsx';
import axios from 'axios';

// const initialIssues = [
//   {
//     id: 1, status: 'New', owner: 'Ravan', effort: 5,
//     created: new Date('2018-08-15'), due: undefined,
//     title: 'Error in console when clicking Add',
//   },
//   {
//     id: 2, status: 'Assigned', owner: 'Eddie', effort: 14,
//     created: new Date('2018-08-16'), due: new Date('2018-08-30'),
//     title: 'Missing bottom border on panel',
//   },
// ];

export default class IssueList extends React.Component {
  constructor() {
    super();
    this.state = {
      issues: [],
      toastVisible: false,
      toastMessage: '',
      toastType: 'info',
    };
  //  this.closeIssue = this.closeIssue.bind(this);
    this.deleteIssue = this.deleteIssue.bind(this);
    this.showSuccess = this.showSuccess.bind(this);
    this.showError = this.showError.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
  }



  componentDidMount() {
    console.log('componentDidMount()');
    this.loadData();
  }

  async loadData() {
    // apiUrl = window.ENV.UI_API_ENDPOINT + '/issues'
    console.log('loadData()');

    try {
      const response = await axios.get('/api/issues');
      console.log(response);
      this.setState({
        issues: response.data
        })
    } catch (error) {
      console.error(error);
    }
    console.log('loadData() ended');


    // setTimeout(() => {
    //   this.setState({ issues: initialIssues });
    // }, 500);
  }

  componentDidUpdate(prevProps) {
    const { location: { search: prevSearch } } = prevProps;
    const { location: { search } } = this.props;
    if (prevSearch !== search) {
      this.loadData();
    }
  }



  // async closeIssue(index) {
  //   const query = `mutation issueClose($id: Int!) {
  //     issueUpdate(id: $id, changes: { status: Closed }) {
  //       id title status owner
  //       effort created due description
  //     }
  //   }`;
  //   const { issues } = this.state;
  //   const data = await graphQLFetch(query, { id: issues[index].id },
  //     this.showError);
  //   if (data) {
  //     this.setState((prevState) => {
  //       const newList = [...prevState.issues];
  //       newList[index] = data.issueUpdate;
  //       return { issues: newList };
  //     });
  //   } else {
  //     this.loadData();
  //   }
  // }

  async deleteIssue(index) {
    const query = `mutation issueDelete($id: Int!) {
      issueDelete(id: $id)
    }`;
    const { issues } = this.state;
    const { location: { pathname, search }, history } = this.props;
    const { id } = issues[index];
// 
    try {
      const response = await axios.delete('/api/issues/' + id);
      console.log(response);
      this.setState({
        issues: response.data
        })
    } catch (error) {
      console.error(error);
    }
    console.log('loadData() ended');
    history.push({ pathname: '/issues', search });
    this.loadData();
    // const data = await graphQLFetch(query, { id }, this.showError);
    // if (data && data.issueDelete) {
    //   this.setState((prevState) => {
    //     const newList = [...prevState.issues];
    //     if (pathname === `/issues/${id}`) {
    //       history.push({ pathname: '/issues', search });
    //     }
    //     newList.splice(index, 1);
    //     return { issues: newList };
    //   });
    //   this.showSuccess(`Deleted issue ${id} successfully.`);
    // } else {
    //   this.loadData();
    // }
  }

  showSuccess(message) {
    this.setState({
      toastVisible: true, toastMessage: message, toastType: 'success',
    });
  }

  showError(message) {
    this.setState({
      toastVisible: true, toastMessage: message, toastType: 'danger',
    });
  }

  dismissToast() {
    this.setState({ toastVisible: false });
  }

  render() {
    const { issues } = this.state;
    const { toastVisible, toastType, toastMessage } = this.state;
    const { match } = this.props;
    return (
      <React.Fragment>
        <Panel>
          <Panel.Heading>
            <Panel.Title toggle>Filter</Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>
            <IssueFilter />
          </Panel.Body>
        </Panel>
        <IssueTable
          issues={issues}
          
          deleteIssue={this.deleteIssue}
        />
        <Route path={`${match.path}/:id`} component={IssueDetail} />
        <Toast
          showing={toastVisible}
          onDismiss={this.dismissToast}
          bsStyle={toastType}
        >
          {toastMessage}
        </Toast>
      </React.Fragment>
    );
  }
}
