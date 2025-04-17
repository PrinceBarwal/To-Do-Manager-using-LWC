public with sharing class toDoAppController {
    @AuraEnabled(cacheable=true)
    public static List<Task_Manager__c> loadAllInCompletedTask(){
        return [
            SELECT Id, Name, Task_Date__c, Completed_Date__c, isCompleted__c
            FROM Task_Manager__c
            WHERE ownerId =: userInfo.getUserId()
            AND isCompleted__c = false
            WITH USER_MODE
            ORDER BY Task_Date__c
        ];
    }


    @AuraEnabled(cacheable=true)
    public static List<Task_Manager__c> loadAllCompletedTask(){
        return [
            SELECT Id, Name, Task_Date__c, Completed_Date__c, isCompleted__c
            FROM Task_Manager__c
            WHERE ownerId =: userInfo.getUserId()
            AND isCompleted__c = true
            WITH USER_MODE
            ORDER BY Completed_Date__c DESC
        ];
    }
}