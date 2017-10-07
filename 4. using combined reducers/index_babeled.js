'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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

var _Redux = Redux,
    combineReducers = _Redux.combineReducers; // import

var todoApp = combineReducers({
    todos: todos,
    visibilityFilter: visibilityFilter
});

var _React = React,
    Component = _React.Component;


var Link = function Link(_ref) {
    var active = _ref.active,
        children = _ref.children,
        _onClick = _ref.onClick;

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

var FilterLink = function (_Component) {
    _inherits(FilterLink, _Component);

    function FilterLink() {
        _classCallCheck(this, FilterLink);

        return _possibleConstructorReturn(this, (FilterLink.__proto__ || Object.getPrototypeOf(FilterLink)).apply(this, arguments));
    }

    _createClass(FilterLink, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            var store = this.context.store;

            this.unsubscribe = store.subscribe(function () {
                return _this2.forceUpdate();
            });
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.unsubscribe();
        }
    }, {
        key: 'render',
        value: function render() {
            var props = this.props;
            var store = this.context.store;

            var state = store.getState();

            return React.createElement(
                Link,
                { active: props.filter === state.visibilityFilter,
                    onClick: function onClick() {
                        return store.dispatch({
                            type: 'SET_VISIBILITY_FILTER',
                            filter: props.filter
                        });
                    } },
                ' ',
                props.children,
                ' '
            );
        }
    }]);

    return FilterLink;
}(Component);

FilterLink.contextTypes = {
    store: React.PropTypes.object
};

var AddTodo = function AddTodo(props, _ref2) {
    var store = _ref2.store;

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
                    store.dispatch({
                        type: 'ADD_TODO',
                        id: nextTodoId++,
                        text: input.value });
                    input.value = '';
                } },
            'Add Todo'
        )
    );
};

AddTodo.contextTypes = {
    store: React.PropTypes.object
};

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

var VisibleTodoList = function (_Component2) {
    _inherits(VisibleTodoList, _Component2);

    function VisibleTodoList() {
        _classCallCheck(this, VisibleTodoList);

        return _possibleConstructorReturn(this, (VisibleTodoList.__proto__ || Object.getPrototypeOf(VisibleTodoList)).apply(this, arguments));
    }

    _createClass(VisibleTodoList, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this4 = this;

            var store = this.context.store;

            this.unsubscribe = store.subscribe(function () {
                return _this4.forceUpdate();
            });
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.unsubscribe();
        }
    }, {
        key: 'render',
        value: function render() {
            var props = this.props;
            var store = this.context.store;

            var state = store.getState();

            return React.createElement(TodoList, {
                todos: getVisibleTodos(state.todos, state.visibilityFilter),
                onTodoClick: function onTodoClick(id) {
                    return store.dispatch({ type: 'TOGGLE_TODO', id: id });
                } });
        }
    }]);

    return VisibleTodoList;
}(Component);

VisibleTodoList.contextTypes = {
    store: React.PropTypes.object
};

var nextTodoId = 0;

var TodoApp = function TodoApp() {
    return React.createElement(
        'div',
        null,
        React.createElement(AddTodo, null),
        React.createElement(VisibleTodoList, null),
        React.createElement(Footer, null)
    );
};

var Provider = function (_Component3) {
    _inherits(Provider, _Component3);

    function Provider() {
        _classCallCheck(this, Provider);

        return _possibleConstructorReturn(this, (Provider.__proto__ || Object.getPrototypeOf(Provider)).apply(this, arguments));
    }

    _createClass(Provider, [{
        key: 'getChildContext',
        value: function getChildContext() {
            return {
                store: this.props.store
            };
        }
    }, {
        key: 'render',
        value: function render() {
            return this.props.children;
        }
    }]);

    return Provider;
}(Component);

Provider.childContextTypes = {
    store: React.PropTypes.object
};

var _Redux2 = Redux,
    createStore = _Redux2.createStore;


ReactDOM.render(React.createElement(
    Provider,
    { store: createStore(todoApp) },
    React.createElement(TodoApp, null)
), document.getElementById('root'));
