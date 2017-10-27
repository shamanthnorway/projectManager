import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import NavigationBar from './navigation';

class Tasks extends Component {
    renderTasksList() {
        return this.props.user.team.tasks.map((task)=> {
            return (
                <tr key={task._id}>
                    <td>
                        <Link to={`/teams/${this.props.user.team._id}/tasks/${task._id}`} >
                            {task.description}
                        </Link>
                    </td>
                    <td>Users</td>
                    <td>{task.createdAt}</td>
                    <td>{task.updatedAt}</td>
                    <td>
                        <div className="progress">
                            <div 
                                className="progress-bar" 
                                role="progressbar" 
                                aria-valuenow="70"
                                aria-valuemin="0" 
                                aria-valuemax="100"  >
                                70%
                            </div>
                        </div>
                    </td>
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
                        <h1>Tasks: {team.teamName}</h1>
                    </div>
                    <div className="col-sm-2">
                        <NavigationBar />
                    </div>
                    <div className="col-sm-10">
                        <div className="btn-group">
                            <button type="button" className="btn btn-default">Add Task</button>
                            <button type="button" className="btn btn-default">Delete Task</button>
                        </div> 
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Task Description</th>
                                    <th>Users</th>
                                    <th>Created On</th>
                                    <th>Updated On</th>
                                    <th className="col-sm-1">Progress</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderTasksList()}
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
    console.log(state);
    return {user: state.user}
}

export default connect(mapStateToProps, null)(Tasks);