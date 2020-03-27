import React, { Component } from "react";
import Loading from "components/Loading"
import Panel from "components/Panel"
import axios from "axios";
import classnames from "classnames";
import {
  getTotalInterviews,
  getLeastPopularTimeSlot,
  getMostPopularDay,
  getInterviewsPerDay
 } from "helpers/selectors";
 
const data = [
  {
    id: 1,
    label: "Total Interviews",
    value: 9
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    value: "1pm"
  },
  {
    id: 3,
    label: "Most Popular Day",
    value: "Wednesday"
  },
  {
    id: 4,
    label: "Interviews Per Day",
    value: "2.3"
  }
];

class Dashboard extends Component {
  constructor() {
    super();

    this.state = { 
      loading: true,
      focused: null,
      days: [],
      appointments: {},
      interviewers: {}
     }

     this.focusFunc = this.focusFunc.bind(this);
  };

  focusFunc(id) {
    this.setState(previousState => ({
      focused: previousState.focused !== null ? null : id
    }));
  }
 
  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));

    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(([days, appointments, interviewers]) => {
      this.setState({
        loading: false,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data
      });
    });

    if (focused) {
      this.setState({ focused });
    }
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }

  render() {
    console.log(this.state)
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused
     });
     

    if (this.state.loading) {
      return <Loading />;
    };

    const panels = data.filter (
      panel => this.state.focused === null || this.state.focused === panel.id)
      .map (panel => (
      <Panel
      key={panel.id}
      id={panel.id}
      label={panel.label}
      value={panel.value}
      onSelect={this.focusFunc}
    />
    ));
      
    return <main className={dashboardClasses}> {panels}</main>;
  }
}

export default Dashboard;
