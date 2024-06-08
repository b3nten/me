import "./styles.css";

import App from "./app";
import { hydrate } from "solid-js/web";

hydrate(() => <App />, document);
