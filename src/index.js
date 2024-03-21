import hh from "hyperscript-helpers";
import { h, diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element";

// allows using html tags as functions in javascript
const { div, button, p, h1, input, label, table, th, td, tr, thead, tbody } =
  hh(h);

// A combination of Tailwind classes which represent a (more or less nice) button style
const btnStyle =
  "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";

// Messages which can be used to update the model
const MSGS = {
  UPDATE_MODEL: "UPDATE_MODEL",
  ADD_ITEM: "ADD_ITEM",
  DELETE_ITEM: "DELETE_ITEM",
  // ... ℹ️ additional messages
};

// View function which represents the UI as HTML-tag functions
function view(dispatch, model) {
  return div({ className: "flex flex-col gap-4 items-center" }, [
    h1({ className: "text-2xl" }, `Weather`),
    div({ className: "flex " }, [
      label({ for: "input1", type: "text" }, "Location"),
      input({ className: "ml-2 shadow-md border w-96 mr-5", id: "input1" }),
      button(
        {
          className: btnStyle,
          onclick: () =>
            dispatch({
              type: MSGS.ADD_ITEM,
              payload: {
                location: document.getElementById("input1").value,
              },
            }),
        },
        "Add"
      ),
    ]),
    div({ className: "flex " }, [
      table([
        thead([
          tr({ className: "p-4" }, [
            th({ className: "p-4" }, "Location"),
            th({ className: "p-4" }, "Temp"),
            th({ className: "p-4" }, "High"),
            th({ className: "p-4" }, "Low"),
            th({ className: "p-4" }, "Action"),
          ]),
        ]),
        tbody(
          { id: "tbody" },
          model.tItems.map((item) =>
            tr([
              td({ className: "p-2 text-center" }, item.location),
              td({ className: "p-2 text-center" }, item.temp.toString()),
              td({ className: "p-2 text-center" }, item.high.toString()),
              td({ className: "p-2 text-center" }, item.low.toString()),
              td([
                button(
                  {
                    className: btnStyle,
                    onclick: () =>
                      dispatch({ type: MSGS.DELETE_ITEM, payload: item.id }),
                  },
                  "Delete"
                ),
              ]),
            ])
          )
        ),
      ]),
    ]),
  ]);
}

// Update function which takes a message and a model and returns a new/updated model
function update(msg, model) {
  switch (
    msg.type // Verwende msg.type, um den Nachrichtentyp zu prüfen
  ) {
    case MSGS.DELETE_ITEM:
      const iddel = msg.payload; // Verwende msg.payload, um auf die Daten zuzugreifen
      const filteredTItems = model.tItems.filter((item) => item.id !== iddel);
      return { ...model, tItems: filteredTItems };
    case MSGS.ADD_ITEM:
      let request = new XMLHttpRequest();
      request.open("GET", "http://192.168.0.196:9000/config.json", false); 
      request.send(null);
      if (request.status === 200) {
        let configData = JSON.parse(request.responseText);
        console.log(configData.apiWeatherKey);
      }
      const location = msg.payload.location;
      const temp = 1;
      const high = 2;
      const low = 1;
      const id = Date.now();
      const newTItem = { id, location, temp, high, low };
      const updatedTItems = model.tItems.concat(newTItem);
      return { ...model, tItems: updatedTItems };

    default:
      return model;
  }
}
// ⚠️ Impure code below (not avoidable but controllable)
function app(initModel, update, view, node) {
  let model = initModel;
  let currentView = view(dispatch, model);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);
  function dispatch(msg) {
    model = update(msg, model);
    const updatedView = view(dispatch, model);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
  }
}

// The initial model when the app starts
const initModel = {
  tItems: [
    {
      id: 1,
      location: "blin",
      temp: 1,
      high: 2,
      low: 1,
    },
  ],
};

// The root node of the app (the div with id="app" in index.html)
const rootNode = document.getElementById("app");

// Start the app
app(initModel, update, view, rootNode);
