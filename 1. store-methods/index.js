

const {createStore} = Redux;

// import { createStore } from 'redux';

const counter = (state=0, action) => {
    switch(action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        default:
            return state;
    }
}

// How createStore works:
// const createStore = (reducer) => {
//     let state;
//     let listeners = [];

//     const getState = () => state;

//     const dispatch = (action) => {
//         state = reducer(state, action);
//         listeners.forEach(listener => lister());
//     };

//     const subscribe = (listener) => {
//         listeners.push(listener);
//         return () => {
//             listeners = listeners.filter(l => l !== listener);
//         }
//     };

//     dispatch({});

//     return {getState, dispatch, subscribe};
// };

const store = createStore(counter);

// console.log(store.getState());

// store.dispatch({type: 'INCREMENT'});

// console.log(store.getState());

const render = () => {
    document.body.innerText = store.getState();
}
render();

// callback after state is updated
store.subscribe(render);

document.addEventListener('click', () => {
    store.dispatch({type: 'INCREMENT'});
});