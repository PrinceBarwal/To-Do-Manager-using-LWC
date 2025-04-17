import { createRecord, deleteRecord, updateRecord } from 'lightning/uiRecordApi';
import { LightningElement, wire } from 'lwc';
import TASK_MANAGER_OBJECT from '@salesforce/schema/Task_Manager__c';
import TASK_MANAGER_NAME from '@salesforce/schema/Task_Manager__c.Name';
import TASK_DATE from '@salesforce/schema/Task_Manager__c.Task_Date__c';
import TASK_COMPLETED_DATE from '@salesforce/schema/Task_Manager__c.Completed_Date__c';
import TASK_IS_COMPLETED from '@salesforce/schema/Task_Manager__c.isCompleted__c';
import TASK_ID from '@salesforce/schema/Task_Manager__c.Id';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import loadAllInCompletedTask from '@salesforce/apex/toDoAppController.loadAllInCompletedTask'
import loadAllCompletedTask from '@salesforce/apex/toDoAppController.loadAllCompletedTask'
import {refreshApex} from '@salesforce/apex';

export default class ToDoApplication extends LightningElement {

    taskName = "";
    taskDate = null;
    incompleteTask = [];
    completedTask = [];
    incompleteTaskResult;
    completeTaskResult;


    @wire(loadAllInCompletedTask)
    wire_inCompleteRecord(result){
        this.incompleteTaskResult = result;
        let {data, error} = result;
        if(data){
            console.log('incompleted Record : ', data);
            this.incompleteTask = data.map(currItem => ({
                taskId : currItem.Id,
                taskName : currItem.Name,
                taskDate : currItem.Task_Date__c
            }));
        }
        else if(error){
            console.log('Error while retriving incomplete task record ' , error);
        }
    }

    @wire(loadAllCompletedTask)
    wire_completedRecord(result){
        this.completeTaskResult = result;
        let {data, error} = result;
        if(data){
            console.log('All Completed Task Record', data);
            this.completedTask = data.map(currItem => ({
                taskName : currItem.Name,
                taskDate : currItem.Task_Date__c
            }));
        }
        else if(error){
            console.log('Error while retreving incomplete task record');
        }
    }

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
        this.taskDate = null;
    }

    addTaskHandler(){
        if(!this.taskDate){
            this.taskDate = new Date().toISOString().slice(0,10);
        }

        // if(this.validateTask()){
        //     this.incompleteTask = [...this.incompleteTask, {
        //         taskName : this.taskName,
        //         taskDate : this.taskDate
        //     }];
        //     this.resetHandler();
        //     let sortedArray = this.sortArray(this.incompleteTask);
        //     this.incompleteTask = [...sortedArray];
        //     //console.log("this.incompleteTask", this.incompleteTask);
        // }

        let inputFields = {};
        inputFields[TASK_MANAGER_NAME.fieldApiName] = this.taskName;
        inputFields[TASK_IS_COMPLETED.fieldApiName] = false;
        inputFields[TASK_DATE.fieldApiName] = this.taskDate;

        
        let inputRecord = {
            apiName : TASK_MANAGER_OBJECT.objectApiName,
            fields  : inputFields
        };
        createRecord(inputRecord)
        .then(result => {
            //alert('inside then method');
            console.log('Task Created Successfully', result);
            this.showToast('Success', 'Task Manager Record Created Successfully', 'success');
            this.resetHandler();
            refreshApex(this.incompleteTaskResult);
        })
        .catch(error => {
            //alert('inside catch method');
            console.log('Unable to create a task', error);
            this.showToast('Error', 'Unable to Create Task Manager Record', 'error');
        })
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
            let dateA = new Date(a.taskDate);
            let dateB = new Date(b.taskDate);
            return dateA - dateB;
        })
        return sortedArray;
    }

    removalHandler(event){
        let recordId = event.target.name;
        // let index = event.target.name;
        // this.incompleteTask.splice(index, 1);
        // let sortedArray = this.sortArray(this.incompleteTask);
        // this.incompleteTask = [...sortedArray];
        //console.log("this.incompleteTask", this.incompleteTask);

        console.log('Record Id', recordId);

        deleteRecord(recordId)
        .then(() =>{
            this.showToast('Success', 'Record Delted Successfully', 'success');
            refreshApex(this.incompleteTaskResult);
        })
        .catch(error => {
            this.showToast('Error', 'Unable to Delete Record', 'error');
        })
    }

    completeTaskHandler(event){
        console.log('inside the complete Task handler');
        // let index = event.target.name;
        // this.refreshData(index);
        let recordId = event.target.name;
        this.refreshData(recordId);
        
    }

    dragStartHandler(event){
        event.dataTransfer.setData("index", event.target.dataset.item)
    }

    allowDrop(event){
        event.preventDefault();
    }

    dropElementHandler(event){
        let index = event.dataTransfer.getData("index");
        this.refreshData(index);
    }

    refreshData(recordId){
        console.log('inside the refresh Data');
        console.log('Record Id', recordId);
        // let removeItem = this.incompleteTask.splice(index, 1);
        // let sortedArray = this.sortArray(this.incompleteTask);
        // this.incompleteTask = [...sortedArray];
        // //console.log("this.incompleteTask", this.incompleteTask);
        // this.completedTask = [...this.completedTask, removeItem[0]];

        let inputFields = {};
        inputFields[TASK_ID.fieldApiName] = recordId;
        inputFields[TASK_IS_COMPLETED.fieldApiName] = true;
        inputFields[TASK_COMPLETED_DATE.fieldApiName] = new Date().toISOString().slice(0,10);

        let recordInput = {
            fields : inputFields
        }

        // try{
        //     await updateRecord(recordInput);
        //     await refreshApex(this.incompleteTaskResult);
        //     await refreshApex(this.completeTaskResult);
        //     this.showToast('Success', 'Record Update Successfully', 'success');
        // }
        // catch(error){
        //     console.log('error',error);
        //     this.showToast('Error', 'Unable to Udpate the Record', 'error');
        // }

        updateRecord(recordInput)
        .then(result => {
            this.showToast('Success', 'Record Update Successfully', 'success');
            refreshApex(this.incompleteTaskResult);
            refreshApex(this.completeTaskResult);
        })
        .catch(error => {
            this.showToast('Error', 'Unable to Udpate the Record', 'error');
        })
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant : variant
        });
        this.dispatchEvent(event);
    }
}