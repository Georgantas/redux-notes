
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

const todos = (state = [], action) => {
    switch(action.type){
        case 'ADD_TODO':
            return [
                ...state,
                {
                    id: action.id,
                    text: action.text,
                    completed: false
                }
            ]
        default:
            return state;
    }
};

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

testAddTodo();
console.log('PART II: All tests passed.')