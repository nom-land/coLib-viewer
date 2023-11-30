import Nomland from "nomland.js/browser";
import { sourceName } from ".";

export function createNomland() {
    return new Nomland(sourceName);
}
