import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchTeam } from '../actions';
import NavigationBar from './navigation';

class Team extends Component {
    componentDidMount() {
        const { teamID } = this.props.match.params;
        this.props.fetchTeam(teamID);  
    }
    render() {
        if(!this.props.user.user) return <div>Please login</div>;
        if(!this.props.user.team) return <div>Loading Team</div>;
        else {
            const { user } = this.props.user;
            const { team } = this.props.user;
            return (
                <div  className="container">
                    <div className="jumbotron"><h1>{team.teamName}</h1></div>
                    <div className="col-sm-2">
                        <NavigationBar />
                    </div>
                    <div className="col-sm-10">

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

export default connect(mapStateToProps, { fetchTeam })(Team);