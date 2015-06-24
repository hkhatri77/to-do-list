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

import $ from 'jquery'
Parse.$ = $
Parse.initialize('r8DKqSzMLtTTxeByq6eGiC3SNGdWsR303kGcM161', 'vsjmj2z2VHi0bDc19ppCBIF3EuMShLc3etEtR5JV')


const list = new Tasks()

list.query = new Parse.Query(Task)
list.fetch()

class TaskView extends React.Component {
    constructor(props){
        super(props)
        this.rerender = () => {
        	this.props.data.save()
        	this.forceUpdate()
        }
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
        this.props.data.on('update sync', this.rerender)
    }
    componentDidUnmount(){
        this.props.data.off('update sync', this.rerender)
    }
    _add(e){
        e.preventDefault()
        var input = React.findDOMNode(this.refs.title)
        var model = new Task({title: input.value})
        var acl = new Parse.ACL()
        acl.setWriteAccess(Parse.User.current(), true)
        acl.setPublicReadAccess(allowed)


        model.setACL(new Parse.ACL())


        this.props.data.create({ title: input.value })
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

class LoginView extends React.Component {
	constructor(props){
		super(props)
	}

	_signupOrLogin(){
		var u = new Parse.User(), 
			email = React.findDOMNode(this.refs.email).value,
			password = React.findDOMNode(this.refs.password).value

			u.set({
				email: email,
				password: password,
				username: email
			})

		var signup = u.signUp()
			signup.then((e) => window.location.hash = '#list')
			signup.fail((e) => {
				var login = u.logIn()
				login.then((e) => window.location.hash = '#list')
				login.fail((...args) => {
					this.setState({error: "Invalid Password"})
				})
			})
	}

	render(){
		return (<div>
					<form onSubmit={(e) => this._signupOrLogin(e)}>
					<p> Login or Register </p>
					<hr/>
					<div><input type="email" ref="email" placeholder="email"/></div>
					<div><input type="password" ref="password" placeholder="password"/></div>
					<div><button>Submit</button></div>
					</form>
			</div>)
	}
}

var router = Parse.Router.extend ({
	routes: {
		'list': 'list',
		'*default': 'login'
	},

	initialize: () => {
		Parse.history.start()
	},

	list: () => {
		if(Parse.User.current()){
			window.location.hash = '#login'
			return
		},

		list.fetch()
		React.render(<ListView data={list}/> document.querySelector('.container'))

	login: () => {
			if(Parse.User.current()){
			window.location.hash = '#list'
			return
		}

		React.render(<LoginView />, document.querySelector('.container'))
	
	}

})


React.render(<ListView data={list} />, document.querySelector('.container'))
window.list = list