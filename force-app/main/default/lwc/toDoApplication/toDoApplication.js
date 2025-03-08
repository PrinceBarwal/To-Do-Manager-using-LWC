import { LightningElement } from 'lwc';

export default class ToDoApplication extends LightningElement {

    taskName = "";
    taskDate = null;

    changeHandler(event){
        let {name, value} = event.target;
        if(name === "taskName"){
            this.taskName = value;
        }
        else if(name === "taskDate"){
            this.taskDate = value;
        }
    }
}