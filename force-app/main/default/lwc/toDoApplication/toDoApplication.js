import { LightningElement } from 'lwc';

export default class ToDoApplication extends LightningElement {

    taskName = "";
    taskDate = null;
    incompleteTask = [];
    completedTask = [];

    changeHandler(event){
        let {name, value} = event.target;
        if(name === "taskName"){
            this.taskName = value;
        }
        else if(name === "taskDate"){
            this.taskDate = value;
        }
    }

    resetHandler(){
        this.taskName = "";
        this.taskData = null;
    }

    addTaskHandler(){
        if(!this.taskData){
            this.taskData = new Date().toISOString().slice(0,10);
        }

        if(this.validateTask()){
            this.incompleteTask = [...this.incompleteTask, {
                taskName : this.taskName,
                taskDate : this.taskData
            }];
            this.resetHandler();
            let sortedArray = this.sortArray(this.incompleteTask);
            this.incompleteTask = [...sortedArray];
            console.log("this.incompleteTask", this.incompleteTask);
        }
    }

    validateTask(){
        let element = this.template.querySelector(".taskname")
        let isValid = true;
        if(!this.taskName){
            isValid = false;
        }else{
            let taskItem = this.incompleteTask.find(
                (currItem) => 
                currItem.taskName === this.taskName && 
                currItem.taskDate === this.taskDate
            );
            if(taskItem){
                isValid = false;
                element.setCustomValidity("Task is Already Present.")
            }
        }
        if(isValid){
            element.setCustomValidity("");
        }
        element.reportValidity();
        return isValid;
    }

    sortArray(inputArr){
        let sortedArray = inputArr.sort((a,b) => {
            let dateA = new Date(a.taskData);
            let dateB = new Date(b.taskDate);
            return dateA - dateB;
        })
        return sortedArray;
    }
}