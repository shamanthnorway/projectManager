import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchTeams } from '../actions';

class Teams extends Component {
    componentDidMount() {
        const userID = this.props.user.user._id;
        this.props.fetchTeams(userID);  
    }
    renderTeamsList(){
        return this.props.user.teams.map((team)=> {
            return (
                <li className="col-sm-4" key={team._id}>
                    <Link to={`/teams/${team._id}`} >
                        {team.teamName}
                    </Link>
                </li>
            );
        });
    }
    render() {
        if(!this.props.user.user) return <div>Please login</div>;
        if(!this.props.user.teams) return <div>Loading Team</div>;
        else {
            const { user } = this.props.user;
            const { teams } = this.props.user;
            // console.log(teams);
            return (
                <div>
                    Welcome {user.lastName}, {user.firstName}
                    <ul className="list-group">
                        {this.renderTeamsList()}
                    </ul>
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

export default connect(mapStateToProps, { fetchTeams })(Teams);