import { useReducer } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

/**
 * I came up with this when working on a legacy jsx project. As I tried to convert
 * all the files to typescript without breaking much of their logic, I kept running into
 * issues with the useReducer hook.
 * */

type Actions =
  | {
      type: "increment";
      payload: number;
    }
  | {
      type: "decrement";
      payload: number;
      extraProperty: string;
    };

type ReducerObject<D extends keyof T, T extends { [key in D]: string }, S> = {
  [K in T[D]]: (state: S, action: Omit<Extract<T, { [key in D]: K }>, D>) => S;
};

// none of this is necessary if you use a switch statement instead, I'm aware of that.
// I like this approach a little better even tho it looks a little more complicated.
// It's actually quite intuitive once you understand it.
function reducer(state: number, action: Actions) {
  const reducerOptions: ReducerObject<"type", Actions, number> = {
    increment: (state, action) => {
      return state + action.payload;
    },
    decrement: (state, action) => {
      // doesn't error, the compiler knows action is now related to the decrement action type.
      console.log(action.extraProperty);
      return state - action.payload;
    },
  };

  // sadly necessary since typescript doesn't understand the action is necessarily of the type it's
  // accessing within the object.
  //
  // @ts-expect-error
  return reducerOptions[action.type](state, action);
}

const defaultValue = 0;

function App() {
  const [counter, setCounter] = useReducer(reducer, defaultValue);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCounter({ type: "increment", payload: 1 })}>
          increment
        </button>
        <button
          onClick={() =>
            setCounter({
              type: "decrement",
              payload: 1,
              extraProperty: "hello world my type works!!",
            })
          }
        >
          decrement
        </button>
        <p>count is {counter}</p>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
