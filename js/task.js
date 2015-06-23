import Backbone from 'backbone'


export const Task = Backbone.Model.extend({
    defaults: {
        title: '(no title)',
        due_date: null,
        location: null,
        progress: 'upcoming',
        isUrgent: false
    }
})

export const Tasks = Backbone.Collection.extend({
    model: Task
})