'use strict';

var counter = function counter() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var action = arguments[1];

    switch (action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        default:
            return state;
    }
};

var Counter = function Counter(_ref) {
    var value = _ref.value,
        onIncrement = _ref.onIncrement,
        onDecrement = _ref.onDecrement;
    return React.createElement(
        'div',
        null,
        React.createElement(
            'h1',
            null,
            value
        ),
        React.createElement(
            'button',
            { onClick: onIncrement },
            '+'
        ),
        React.createElement(
            'button',
            { onClick: onDecrement },
            '-'
        )
    );
};

var _Redux = Redux,
    createStore = _Redux.createStore;

var store = createStore(counter);

var render = function render() {
    ReactDOM.render(React.createElement(Counter, {
        value: store.getState(),
        onIncrement: function onIncrement() {
            return store.dispatch({
                type: 'INCREMENT'
            });
        },
        onDecrement: function onDecrement() {
            return store.dispatch({
                type: 'DECREMENT'
            });
        } }), document.getElementById('root'));
};

store.subscribe(render);
render();
