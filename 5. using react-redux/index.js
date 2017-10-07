const { connect } = ReactRedux;

const { Provider } = ReactRedux;

const { createStore } = Redux;

const {combineReducers} = Redux; // import

const {Component} = React;

// action creators
let nextTodoId = 0;
const addTodo = (text) => {
    return {
        type: 'ADD_TODO',
        id: nextTodoId++,
        text
    }
}

const setVisibilityFilter = (filter) => {
    return {
        type: 'SET_VISIBILITY_FILTER',
        filter
    };
};

const toggleTodo = (id) => {
    return {
        type: 'TOGGLE_TODO',
        id
    };
};

// end action creators

const visibilityFilter = (state = 'SHOW_ALL', action) => {
    switch(action.type){
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default:
            return state;
    }
}

const todo = (state, action) => {
    switch(action.type){
        case 'ADD_TODO':
            return {
                id: action.id,
                text: action.text,
                completed: false
            }
        case 'TOGGLE_TODO':
            if(state.id !== action.id){
                return state;
            }

            return {
                ...state,
                completed:!state.completed
            };
        default:
            return state;
    }
}

const todos = (state = [], action) => {
    switch(action.type){
        case 'ADD_TODO':
        return [
            ...state,
            todo(undefined, action)
        ]
        case 'TOGGLE_TODO':
        return state.map(t => todo(t, action));
        default:
        return state;
    }
};


const todoApp = combineReducers({
    todos: todos,
    visibilityFilter: visibilityFilter
})

const Link = ({ active, children, onClick}) => { // order seems to be: props, children, context
    if(active){
        return <span>{children}</span>
    }
    return (<a href='#'
        onClick={e => {
            e.preventDefault();
            onClick();
        }}>
        {children} </a>
    );
};

const mapStateToLinkProps = (
    state,
    ownProps // instead of "props" to make it clear that we are refering to the props of the component itself, not what is passed on
) => {
    return {
        active: ownProps.filter === state.visibilityFilter
    }
}

const mapDispatchToLinkProps = (
    dispatch,
    ownProps
) => {
    return {
        onClick: () => {
            dispatch(setVisibilityFilter(ownProps.filter))
        }
    };
}

const FilterLink = connect(
    mapStateToLinkProps,
    mapDispatchToLinkProps
)(Link)

let AddTodo = ({dispatch}) => {
    let input;

    return (
        <div>
            <input ref={node => { input = node }} />
            <button onClick={() => {
                    dispatch(addTodo(input.value));
                    input.value = '';
                }}>
                    Add Todo
                </button>
        </div>
    );
};

// arguments can safely be fully removed
AddTodo = connect(
    // null, // tells thats there is no need to subscribe to the store
    // dispatch => { // can also be replaced by null
    //     reutnr {dispatch}
    // }
)(AddTodo);

const getVisibleTodos = (
    todos,
    filter
) => {
    switch(filter){
        case 'SHOW_ALL':
            return todos;
        case 'SHOW_COMPLETED':
            return todos.filter( t => t.completed );
        case 'SHOW_ACTIVE':
            return todos.filter( t => !t.completed );
    }
}

const Todo = ({
    onClick,
    completed,
    text
}) => (
<li
    onClick={onClick}
    style={{
        textDecoration: completed ? 'line-through' : 'none'
    }}>
    {text}
</li>
);

const TodoList = ({
    todos,
    onTodoClick
}) => (
    <ul>
        {todos.map(todo =>
            <Todo key={todo.id}
            {...todo}
            onClick={ () => onTodoClick(todo.id)} />
        )}
    </ul>
)

const Footer = () => (
<p> Show:
    {' '}
    <FilterLink filter='SHOW_ALL'>All</FilterLink>
    {' '}
    <FilterLink filter='SHOW_ACTIVE'>Active</FilterLink>
    {' '}
    <FilterLink filter='SHOW_COMPLETED'>Completed</FilterLink>
</p>
)

// refers to state of redux store
const mapStateToTodoListProps = (state) => {
    return {
        todos: getVisibleTodos(state.todos, state.visibilityFilter)
    }
}

const mapDispatchToTodoListProps = (dispatch) => {
    return {
        onTodoClick: id => dispatch(toggleTodo(id))
    }
}

const VisibleTodoList = connect(
    mapStateToTodoListProps,
    mapDispatchToTodoListProps
)(TodoList)


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

const TodoApp = () => (
    <div>
        <AddTodo />
        <VisibleTodoList />
        <Footer />
    </div>
);

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

ReactDOM.render(
    <Provider store={createStore(todoApp)}>
        <TodoApp />
    </Provider>,
    document.getElementById('root')
);
