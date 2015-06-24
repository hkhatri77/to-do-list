export const Task = Parse.Model.extend({
    className: 'Task',
    defaults: {
        title: '(no title)',
        due_date: null,
        location: null,
        progress: 'upcoming',
        isUrgent: false
    }
})

export const Tasks = Parse.Collection.extend({
    model: Task
})