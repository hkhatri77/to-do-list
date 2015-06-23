"use strict";

// es5 polyfills, powered by es5-shim
require("es5-shim")
// es6 polyfills, powered by babel
require("babel/register")

// var Promise = require('es6-promise').Promise
// equivalent to...
import {Promise} from 'es6-promise'
import Backbone from 'backbone'
import React from 'react'
import {Task, Tasks} from './task'

const list = new Tasks([
    {title: 'take out the trash', progress: 'started'},
    {title: 'wash the dog', isUrgent: true},
    {title: 'conquer Earth', progress: 'done'}
])

class TaskView extends React.Component {
    constructor(props){
        super(props)
        this.rerender = () => this.forceUpdate()
    }
    componentDidMount(){
        this.props.data.on('change', this.rerender)
    }
    componentDidUnmount(){
        this.props.data.off('change', this.rerender)
    }
    _toggleDone(){
        var model = this.props.data
        var progress = model.get('progress')
        if(progress !== 'done') {
            model.set('progress', 'done')
        } else {
            model.set('progress', 'upcoming')
        }
    }
    _saveTitle(){
        var text = React.findDOMNode(this.refs.title).innerText
        this.props.data.set('title', text)
    }
    render(){
        var model = this.props.data
        return (<li className={ model.get('progress') }>
            <p contentEditable ref="title" onBlur={() => this._saveTitle()}>{model.get('title')}</p>
            <input type="checkbox"
                checked={model.get('progress') === 'done'}
                onChange={() => this._toggleDone()} />
            <div>
                <input type="date" />
            </div>
        </li>)
    }
}

class ListView extends React.Component {
    constructor(props){
        super(props)
        this.rerender = () => this.forceUpdate()
    }
    componentDidMount(){
        this.props.data.on('update', this.rerender)
    }
    componentDidUnmount(){
        this.props.data.off('update', this.rerender)
    }
    _add(e){
        e.preventDefault()
        var input = React.findDOMNode(this.refs.title)
        this.props.data.add({ title: input.value })
        input.value = ''
    }
    render(){
        return (<div>
            <form onSubmit={(e) => this._add(e)}>
                <div><input ref="title"/></div>
                <button>+</button>
            </form>
            <ul>
                {this.props.data.map((model) => <TaskView data={model} />)}
            </ul>
        </div>)
    }
}

React.render(<ListView data={list} />, document.querySelector('.container'))
window.list = list