import React, { Component } from 'react';
import { connect } from 'react-redux';

class DeleteItem extends Component {
    deleteItem() {
        console.log('Submit button was clicked!');
        // this.props.history.push(this.props.historyPath);
    }
    render() {
        console.log(this.props);
        return (
            <div className="container">
                <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#myModal" >
                    <span className="glyphicon glyphicon-trash"></span> Delete Task 
                </button>

                <div id="myModal" className="modal fade" role="dialog" >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                <h4 className="modal-title">Delete Task</h4>
                            </div>
                            <div className="modal-body">
                                <p>Please press the "Confirm" button to confirm {this.props.item} delete.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-danger" onClick={() => this.deleteItem()}>Confirm</button>
                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(null, null)(DeleteItem);