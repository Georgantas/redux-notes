
// PART I: Avoiding mutations

const addCounter = (list) => {
    return [...list, 0];
};

const removeCounter = (list, index) => {
    // return list.slice(0, index).concat(list.slice(index+1));
    return [...list.slice(0, index), ...list.slice(index+1)];
};

const incrementCounter = (list, index) => {
    return [...list.slice(0, index), list[index] + 1, ...list.slice(index+1)];
};

const toggleTodo = (todo) => {
    return Object.assign({}, todo, {
        completed: !todo.completed
    });
};

// ------------------------------------------------------ //

const testToggleTodo = () => {
    const todoBefore = {
        id: 0,
        text: 'Learn Redux',
        completed: false
    };

    deepFreeze(todoBefore);

    const todoAfter = {
        id: 0,
        text: 'Learn Redux',
        completed: true
    }

    expect(toggleTodo(todoBefore)).toEqual(todoAfter);

}

const testIncrementCounter = () => {
    const listBefore = [0, 10, 20];
    const listAfter = [0, 11, 20];

    deepFreeze(listBefore);

    expect(incrementCounter(listBefore, 1)).toEqual(listAfter);
};

const testAddCounter = () => {
    const listBefore = [];
    const listAfter = [0];

    deepFreeze(listBefore);

    expect(
        addCounter(listBefore)
    ).toEqual(listAfter);
};

const testRemoveCounter = () => {
    const listBefore = [0, 10, 20];
    const listAfter = [0, 20];

    deepFreeze(listBefore);

    expect(removeCounter(listBefore, 1)).toEqual(listAfter);
};

testToggleTodo();
testIncrementCounter();
testRemoveCounter();
testAddCounter();
console.log('PART I: All tests passed.');

// PART II: Avoiding mutations in reducers

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

const visibilityFilter = (state = 'SHOW_ALL', action) => {
    switch(action.type){
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
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

//Equivalent to below
const {combineReducers} = Redux; // import

// const combineReducers = (reducers) => {
//     return (state = {}, action) => {
//         return Object.keys(reducers).reduce( // as in array reduce
//             (nextState, key) => {
//                 nextState[key] = reducers[key](state[key], action);
//                 return nextState;
//             },
//             {}
//         )
//     };
// }

// Equivalent to below
const todoApp = combineReducers({
    todos: todos,
    visibilityFilter: visibilityFilter
})

// const todoApp = (state = {}, action) => {
//     return {
//         todos: todo(
//             state.todos,
//             action
//         ),
//         visibilityFilter: visibilityFilter(
//             state.visibilityFilter,
//             action
//         )
//     };
// };

const testAddTodo = () => {
    const stateBefore = [];
    const action = {
        type: 'ADD_TODO',
        id: 0,
        text: 'Learn Redux'
    };
    const stateAfter = [
        {
            id: 0,
            text: 'Learn Redux',
            completed: false
        }
    ];

    deepFreeze(stateBefore);
    deepFreeze(action);
    
    expect(todos(stateBefore, action)).toEqual(stateAfter);
}

const testToggleTodo2 = () => {
    const stateBefore = [
        {
            id: 0,
            text: 'Learn Redux',
            completed: false
        },
        {
            id: 1,
            text: 'Go shopping',
            completed: false
        }
    ];

    const action = {
        type: 'TOGGLE_TODO',
        id: 1
    };

    const stateAfter = [
        {
            id: 0,
            text: 'Learn Redux',
            completed: false
        },
        {
            id: 1,
            text: 'Go shopping',
            completed: true
        }
    ];

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(
        todos(stateBefore, action)
    ).toEqual(stateAfter);
};

testAddTodo();
testToggleTodo2();
console.log('PART II: All tests passed.')