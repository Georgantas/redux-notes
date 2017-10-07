'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _ReactRedux = ReactRedux,
    connect = _ReactRedux.connect;
var _ReactRedux2 = ReactRedux,
    Provider = _ReactRedux2.Provider;
var _Redux = Redux,
    createStore = _Redux.createStore;
var _Redux2 = Redux,
    combineReducers = _Redux2.combineReducers; // import

var _React = React,
    Component = _React.Component;

// action creators

var nextTodoId = 0;
var addTodo = function addTodo(text) {
    return {
        type: 'ADD_TODO',
        id: nextTodoId++,
        text: text
    };
};

var setVisibilityFilter = function setVisibilityFilter(filter) {
    return {
        type: 'SET_VISIBILITY_FILTER',
        filter: filter
    };
};

var toggleTodo = function toggleTodo(id) {
    return {
        type: 'TOGGLE_TODO',
        id: id
    };
};

// end action creators

var visibilityFilter = function visibilityFilter() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'SHOW_ALL';
    var action = arguments[1];

    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default:
            return state;
    }
};

var todo = function todo(state, action) {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                id: action.id,
                text: action.text,
                completed: false
            };
        case 'TOGGLE_TODO':
            if (state.id !== action.id) {
                return state;
            }

            return _extends({}, state, {
                completed: !state.completed
            });
        default:
            return state;
    }
};

var todos = function todos() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var action = arguments[1];

    switch (action.type) {
        case 'ADD_TODO':
            return [].concat(_toConsumableArray(state), [todo(undefined, action)]);
        case 'TOGGLE_TODO':
            return state.map(function (t) {
                return todo(t, action);
            });
        default:
            return state;
    }
};

var todoApp = combineReducers({
    todos: todos,
    visibilityFilter: visibilityFilter
});

var Link = function Link(_ref) {
    var active = _ref.active,
        children = _ref.children,
        _onClick = _ref.onClick;
    // order seems to be: props, children, context
    if (active) {
        return React.createElement(
            'span',
            null,
            children
        );
    }
    return React.createElement(
        'a',
        { href: '#',
            onClick: function onClick(e) {
                e.preventDefault();
                _onClick();
            } },
        children,
        ' '
    );
};

var mapStateToLinkProps = function mapStateToLinkProps(state, ownProps // instead of "props" to make it clear that we are refering to the props of the component itself, not what is passed on
) {
    return {
        active: ownProps.filter === state.visibilityFilter
    };
};

var mapDispatchToLinkProps = function mapDispatchToLinkProps(dispatch, ownProps) {
    return {
        onClick: function onClick() {
            dispatch(setVisibilityFilter(ownProps.filter));
        }
    };
};

var FilterLink = connect(mapStateToLinkProps, mapDispatchToLinkProps)(Link);

var AddTodo = function AddTodo(_ref2) {
    var dispatch = _ref2.dispatch;

    var input = void 0;

    return React.createElement(
        'div',
        null,
        React.createElement('input', { ref: function ref(node) {
                input = node;
            } }),
        React.createElement(
            'button',
            { onClick: function onClick() {
                    dispatch(addTodo(input.value));
                    input.value = '';
                } },
            'Add Todo'
        )
    );
};

// arguments can safely be fully removed
AddTodo = connect()(AddTodo);

var getVisibleTodos = function getVisibleTodos(todos, filter) {
    switch (filter) {
        case 'SHOW_ALL':
            return todos;
        case 'SHOW_COMPLETED':
            return todos.filter(function (t) {
                return t.completed;
            });
        case 'SHOW_ACTIVE':
            return todos.filter(function (t) {
                return !t.completed;
            });
    }
};

var Todo = function Todo(_ref3) {
    var onClick = _ref3.onClick,
        completed = _ref3.completed,
        text = _ref3.text;
    return React.createElement(
        'li',
        {
            onClick: onClick,
            style: {
                textDecoration: completed ? 'line-through' : 'none'
            } },
        text
    );
};

var TodoList = function TodoList(_ref4) {
    var todos = _ref4.todos,
        onTodoClick = _ref4.onTodoClick;
    return React.createElement(
        'ul',
        null,
        todos.map(function (todo) {
            return React.createElement(Todo, _extends({ key: todo.id
            }, todo, {
                onClick: function onClick() {
                    return onTodoClick(todo.id);
                } }));
        })
    );
};

var Footer = function Footer() {
    return React.createElement(
        'p',
        null,
        ' Show:',
        ' ',
        React.createElement(
            FilterLink,
            { filter: 'SHOW_ALL' },
            'All'
        ),
        ' ',
        React.createElement(
            FilterLink,
            { filter: 'SHOW_ACTIVE' },
            'Active'
        ),
        ' ',
        React.createElement(
            FilterLink,
            { filter: 'SHOW_COMPLETED' },
            'Completed'
        )
    );
};

// refers to state of redux store
var mapStateToTodoListProps = function mapStateToTodoListProps(state) {
    return {
        todos: getVisibleTodos(state.todos, state.visibilityFilter)
    };
};

var mapDispatchToTodoListProps = function mapDispatchToTodoListProps(dispatch) {
    return {
        onTodoClick: function onTodoClick(id) {
            return dispatch(toggleTodo(id));
        }
    };
};

var VisibleTodoList = connect(mapStateToTodoListProps, mapDispatchToTodoListProps)(TodoList);

// NO LONGER REQUIRED
// class VisibleTodoList extends Component {
//     componentDidMount() {
//         const {store} = this.context;
//         this.unsubscribe = store.subscribe(()=> this.forceUpdate());
//     }

//     componentWillUnmount(){
//         this.unsubscribe();
//     }

//     render() {
//         const props = this.props;
//         const { store } = this.context;
//         const state = store.getState();

//         return (
//             <TodoList
//             todos={getVisibleTodos(state.todos, state.visibilityFilter)}
//             onTodoClick={id => store.dispatch({type: 'TOGGLE_TODO', id})} />
//         )
//     }
// }

// VisibleTodoList.contextTypes = {
//     store: React.PropTypes.object
// };

var TodoApp = function TodoApp() {
    return React.createElement(
        'div',
        null,
        React.createElement(AddTodo, null),
        React.createElement(VisibleTodoList, null),
        React.createElement(Footer, null)
    );
};

// No longer needed, provided in 'react-redux'
// class Provider extends Component {
//     getChildContext(){
//         return {
//             store: this.props.store
//         };
//     }

//     render(){
//         return this.props.children;
//     }
// }

// Provider.childContextTypes = {
//     store: React.PropTypes.object
// };

ReactDOM.render(React.createElement(
    Provider,
    { store: createStore(todoApp) },
    React.createElement(TodoApp, null)
), document.getElementById('root'));
