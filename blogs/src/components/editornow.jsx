import React, { Component } from "react";
import ReactDOM from "react-dom";
import { createReactEditorJS } from "react-editor-js";
import { EDITOR_JS_TOOLS } from "constants";

class ReactEditor extends Component {
  componentDidMount() {
    ReactDOM.render(
      <ReactEditorJS tools={EDITOR_JS_TOOLS} />,
      document.getElementById("app")
    );
  }

  render() {
    return <div id="app"></div>;
  }
}

export default ReactEditor;