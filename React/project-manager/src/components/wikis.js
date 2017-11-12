import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import NavigationBar from './navigation';
import { fetchWikis } from '../actions';

class Wikis extends Component {
    componentDidMount() {
        const { teamID } = this.props.match.params;
        this.props.fetchWikis(teamID);  
    }
    renderWikisList() {
        return this.props.user.wikis.map((wiki)=> {
            return (
                <li key={wiki._id}>
                    <Link to={`/teams/${this.props.user.team._id}/wikis/${wiki._id}`} >
                        {wiki.title}
                    </Link>
                </li>
            );
        });
    }
    render() {
        if(!this.props.user.user) return <div>Please login</div>;
        if(!this.props.user.wikis) return <div>Loading Wiki</div>;
        else {
            const { team } = this.props.user;
            return (
                <div  className="container">
                    <div className="jumbotron">
                        <h1>Wikis: {team.teamName}</h1>
                    </div>
                    <div className="col-sm-2">
                        <NavigationBar />
                    </div>
                    <div className="col-sm-10">
                        <button type="button" className="btn btn-default">Add Wiki</button>
                        <ul className="list-group">
                            {this.renderWikisList()}
                        </ul>                   
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

export default connect(mapStateToProps, { fetchWikis })(Wikis);