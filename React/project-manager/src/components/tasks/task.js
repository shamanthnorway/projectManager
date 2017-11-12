import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchTask } from '../../actions';
import NavigationBar from '../navigation';
import DeleteItem from '../delete_item';

class Task extends Component {
    componentDidMount() {
        // console.log('Inside view Task',this.props);
        const taskID = this.props.match.params.taskID;
        this.props.fetchTask(taskID);
    }

    renderUserList() { 
        // console.log('Inside renderUserList',this.props);       
        const { task } = this.props;
        return task.users.map((user) => {
            <div>{user.firstName} {user.firstName}</div>
        });
    };

    renderUpdates() {
        // console.log('Inside renderUpdates',this.props);
        var index = 0;
        return this.props.task.updates.map((update) => {
            index++;
            return (
                <tr key={index}>
                    <td>{update.updatedBy.firstName} {update.updatedBy.lastName}</td>
                    <td>{update.updateDescription}</td>
                    <td>{update.timestamps}</td>
                </tr>
            );
        });
    }
    render() {
        // console.log('Inside view Task',this.props);
        if(!this.props.user) return <div>Please login</div>;
        if(!this.props.task) return <div>Loading Task</div>;
        else {
            const { task } = this.props;
            return (
                <div  className="container">
                    <div className="col-sm-2">
                        <NavigationBar />
                    </div>
                    <div className="col-sm-10">
                        <h2>{task.description}<span className="badge badge-secondary">{task.status}</span></h2><br/>
                        <h3>Created By: {task.createdBy.firstName} {task.createdBy.firstName}</h3><br/>
                        <h3>Assigned To: {this.renderUserList()}</h3><br/>
                        <h3>Status: {task.status}</h3>
                        <DeleteItem item="task" itemID={task._id} historyPath={`/teams/${this.props.match.params.teamID}/tasks`} />
                        <table className="table">
                            <tbody>
                                {this.renderUpdates()}
                            </tbody>
                        </table>                        
                        <Link to={`/teams/${this.props.match.params.teamID}/tasks`} >
                            <button type="button" className="btn btn-primary">Back</button>
                        </Link>                        
                    </div>
                </div>
            );
        }        
    }
}

function mapStateToProps(state) {
    if(!state) return null;
    // console.log(state);
    return {
        user: state.user.user,
        task: state.user.task
    }
}

export default connect(mapStateToProps, { fetchTask })(Task);