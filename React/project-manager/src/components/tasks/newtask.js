import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { postTask } from '../../actions';
import NavigationBar from '../navigation';

class NewTask extends Component {
    renderFieldText(field) {
        const { meta : { touched, error } } = field;
        const className = `form-group ${touched && error ? 'has-danger' : ''}`;
        return(
            <div className={className}>
                <label>{field.label}</label>
                <input
                    type={field.input.name}
                    className="form-control"
                    {...field.input} />
                <div className="text-help">
                    {touched ? error : ''}
                </div>
            </div>
        );
    }
    onCreateNewTaskSubmit(values) {
        values["createdBy"] = this.props.user._id;
        values["updates"] = {
            "updatedBy":this.props.user._id,
            "updateDescription": `Task created at ${new Date()}`
        }
        console.log(values);
        this.props.postTask(values, (response) => {
            console.log(response);
            this.props.history.push(`/teams/${this.props.team._id}/tasks`);
        })
    }
    render() {
        // console.log(this.props);
        const { handleSubmit } = this.props;
        if(!this.props.user) return <div>Please login</div>;
        if(!this.props.team) return <div>Select a team</div>;
        return (
            <div>
                <form onSubmit={ handleSubmit(this.onCreateNewTaskSubmit.bind(this)) } >
                    <Field 
                        label="Description"
                        name="description"
                        component={this.renderFieldText} />
                    <Field 
                        label="Status"
                        name="status"
                        component={this.renderFieldText} />
                    <button className="btn btn-primary" type="submit">Submit</button>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    if(!state) return null;
    // console.log(state);
    return {
        user: state.user.user,
        team: state.user.team
    }
}

export default reduxForm({
    form:'PostsNewForm'
})(
    connect(mapStateToProps, { postTask })(NewTask)
);