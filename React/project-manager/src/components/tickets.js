import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import NavigationBar from './navigation';

class Tickets extends Component {
    renderTicketsList() {
        return this.props.user.team.tickets.map((ticket)=> {
            return (
                <tr key={ticket._id}>
                    <td>
                        <Link to={`/teams/${this.props.user.team._id}/tickets/${ticket._id}`} >
                            {ticket.description}
                        </Link>
                    </td>
                    <td>{ticket.createBy}</td>
                    <td>{ticket.createdAt}</td>
                    <td>{ticket.status}</td>
                    <td>{ticket.serverity}</td>
                </tr>
            );
        });
    }
    render() {
        if(!this.props.user.user) return <div>Please login</div>;
        if(!this.props.user.team) return <div>Loading Team</div>;
        else {
            const { team } = this.props.user;
            return (
                <div  className="container">
                    <div className="jumbotron">
                        <h1>Tickets: {team.teamName}</h1>
                    </div>
                    <div className="col-sm-2">
                        <NavigationBar />
                    </div>
                    <div className="col-sm-10">
                        <div className="btn-group">
                            <button type="button" className="btn btn-default">Add Ticket</button>
                            <button type="button" className="btn btn-default">Delete Ticket</button>
                        </div> 
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Ticket Description</th>
                                    <th>Users</th>
                                    <th>Created On</th>
                                    <th>Status</th>
                                    <th>Severity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderTicketsList()}
                            </tbody>
                        </table>                    
                    </div>
                </div>
            );
        }        
    }
}

function mapStateToProps(state) {
    if(!state) return null;
    // console.log(state);
    return {user: state.user}
}

export default connect(mapStateToProps, null)(Tickets);