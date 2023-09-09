import Nomland from "nomland.js";
import { sourceName } from ".";

export function createNomland() {
    return new Nomland(sourceName);
}
