import React from 'react';
import axios from 'axios';

import './task.scss';

const form = {
  id: "",
  message: "",
  created_on: "",
  due_date: "",
  assigned_name: "",
  assigned_to: "",
  priority: ""
}

class TaskManagement extends React.Component {
  constructor() {
    super();
    this.state = {
      tasks: [],
      users: [],
      searchTerm: "",
      editTaskId: "",
      editFormData: form,
      isActiveCreateTask: false
    };
  }

  componentDidMount() {
    this.getAllUser();
    this.getAllTask();
  }

  getAllTask = () => {
    axios({
      method:'GET',
      url: "https://devza.com/tests/tasks/list",
      headers:{
          AuthToken: "UrM4YHgb1FcqEf1tuKwmAMMX5MxFZ12a"
      }
      }).then(res => {
          if(res.status === 200 && res.data) {
            const tasks = res.data.tasks;
            this.setState({ tasks });
          }
      })
  }

  getAllUser = () => {
    axios({
      method:'GET',
      url: "https://devza.com/tests/tasks/listusers",
      headers:{
          AuthToken: "UrM4YHgb1FcqEf1tuKwmAMMX5MxFZ12a"
      }
      }).then(res => {
          if(res.status === 200 && res.data) {
            const users = res.data.users;
            this.setState({ users });
          }
      })
  }

  editTask = (activeTaskId, data) => {
    let formData = {
      id: data.id,
      message: data.message,
      created_on: data.created_on,
      due_date: data.due_date,
      assigned_name: data.assigned_name,
      assigned_to: data.assigned_to,
      priority: data.priority
    }
    this.setState({
      ...this.state,
      editTaskId: activeTaskId,
      editFormData: formData,
      isActiveCreateTask: false
    })
  }

  handleOnEdit = (key, event) => {
    this.setState({
      ...this.state,
      editFormData: {
        ...this.state.editFormData,
        [key]: event.target.value
      }
    })
  }

  deleteTask = (id) => {
    const formData = new FormData()
    formData.append('taskid', id)
    axios({
      method:'POST',
      url: "https://devza.com/tests/tasks/delete",
      data: formData,
      headers: {
          AuthToken: "UrM4YHgb1FcqEf1tuKwmAMMX5MxFZ12a"
      }
      }).then(res => {
          console.log("res deleted",res);
          if(res.data && res.data.status === "success") {
            this.getAllTask();
            alert("Task deleted successfully.")
          } else {
            alert(res.data.error)
          }
      })
  }

  createTask = () => {
    const bodyFormData = {
      message: this.state.editFormData.message,
      due_date: this.state.editFormData.due_date,
      priority: this.state.editFormData.priority,
      assigned_to: this.state.editFormData.assigned_to,
    }
    const formData = new FormData()
    Object.keys(bodyFormData).forEach((key) => {
      formData.append(key, bodyFormData[key])
    })
    axios({
      method:'POST',
      url: "https://devza.com/tests/tasks/create",
      data: formData,
      headers:{
          AuthToken: "UrM4YHgb1FcqEf1tuKwmAMMX5MxFZ12a"
      }
      }).then(res => {
          console.log("res",res);
          if(res.data && res.data.status === "success") {
            this.getAllTask();
            this.handleStateChange('isActiveCreateTask', false)
            alert("Task created successfully.")
          } else {
            alert(res.data.error)
          }
      })
  }

  updateTask = () => {
    const bodyParam = {
      taskid: this.state.editFormData.id,
      message: this.state.editFormData.message,
      due_date: this.state.editFormData.due_date,
      assigned_to: this.state.editFormData.assigned_to,
      priority: this.state.editFormData.priority
    }
    const formData = new FormData()
    Object.keys(bodyParam).forEach((key) => {
      formData.append(key, bodyParam[key])
    })
    axios({
      method:'POST',
      url: "https://devza.com/tests/tasks/update",
      data: formData,
      headers: {
          AuthToken: "UrM4YHgb1FcqEf1tuKwmAMMX5MxFZ12a"
      }
      }).then(res => {
          console.log("res update",res);
          if(res.data && res.data.status === "success") {
            this.getAllTask();
            this.setState({
              ...this.state,
              editTaskId: null
            })
            alert("Task updated successfully.")
          } else {
            alert(res.data.error)
          }
      })
  }

  handleStateChange = (key, value) => {
    this.setState({
      ...this.state,
      [key]: value
    })
  }

  getTaskContent(title, key, data, type) {
    return (
      <>
        <div>{title}</div>
        {
        this.state.editTaskId ===  data.id || type === 'CREATE_MODE' ?
        <div className="edit-mode">
          <input className="form-control" value={this.state.editFormData[key] || ""} disabled={key === 'id'} onChange={(event)=>{this.handleOnEdit(key, event)}} type="text"></input>
        </div>
        :
        <div className="text-fade">{data[key] || '-'}</div>
        }
      </>
    );
  }

  handleChangeOnSearch = () => {
    console.log("--->",this.state.searchTerm)
  }

  createTaskDOM(data, type) {
    return (
      <div className="row task-container">
      {type === 'EDIT_MODE' && <div className="col-sm-4 task">
        {this.getTaskContent('Task Id', 'id', data, type)}
      </div> }
      <br />
      {type === 'EDIT_MODE' && <div className="col-sm-4 task">
        {this.getTaskContent('Assigned Name', 'assigned_name', data, type)}
      </div>}
      {type === 'EDIT_MODE' && <div className="col-sm-4 task">
        {this.getTaskContent('Created On', 'created_on', data, type)}
      </div>}
      <div className="col-sm-4 task">
        {this.getTaskContent('Priority', 'priority', data, type)}
      </div>
      <div className="col-sm-4 task">
        {this.getTaskContent('Assigned to', 'assigned_to', data, type)}
      </div>
      <div className="col-sm-4 task">
        {this.getTaskContent('Due Date', 'due_date', data, type)}
      </div>
      <div className="col-sm-12 task">
        {this.getTaskContent('Message', 'message', data, type)}
      </div>
      {this.state.editTaskId !== data.id && <div className="action-btn">
        <span className="icon-set edit" onClick={()=>{this.editTask(data.id, data)}}><i className="fa fa-edit fa-lg"></i></span>
        <span className="icon-set delete" onClick={()=>{this.deleteTask(data.id)}}><i className="fa fa-trash fa-lg"></i></span>
      </div>}
      {(this.state.editTaskId === data.id || type === 'CREATE_MODE') && 
      <div className="save">
        <button type="button" onClick={()=>{type === 'EDIT_MODE' ? this.editTask(null, data) : this.handleStateChange('isActiveCreateTask', false) }} className="action-task-btn">Cancel</button>
        <button type="button" onClick={()=>{type === 'EDIT_MODE' ? this.updateTask() : this.createTask()}} className="action-task-btn">{type === 'EDIT_MODE' ? 'Update' : 'Create Task'}</button>
      </div>}
    </div>
    )
  }



  render() {
    return (
      <div className="task-wrapper">
          <div className="search">
            <input className="form-control search-term" value={this.state.searchTerm} onChange={this.handleChangeOnSearch} type="text" placeholder="Search..."></input>
            <span className="icon" onClick={this.handleSubmit} ><i className="fa fa-search fa-lg"></i></span>
          </div>
          {!this.state.isActiveCreateTask && <div className="create-task">
            <button type="button" onClick={()=>{this.handleStateChange('isActiveCreateTask', true)}} className="create-task-btn">Create Task</button>
          </div>}
          {this.state.isActiveCreateTask && this.createTaskDOM(form, 'CREATE_MODE')}
          {this.state.tasks.map((data)=>{
            return (
              <div key={data.id}>
                {this.createTaskDOM(data, 'EDIT_MODE')}
              </div>
            )
          })}
      </div>
    );
  }
}

export default TaskManagement;
