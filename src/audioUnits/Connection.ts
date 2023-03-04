import { CONTEXT } from "../App";
import { ConnectionTypes } from "../ConnectionContext";
import { ZERO } from "./BaseUnit";

export interface Coordinate {
  x: number;
  y: number;
}

export class Connection {
  node: GainNode;
  position: Coordinate;
  name: string;
  type: ConnectionTypes;
  limit: number;

  constructor(name: string, type: ConnectionTypes, limit = Infinity) {
    this.node = CONTEXT.createGain();
    this.type = type;
    this.name = name;
    this.node.gain.value = ZERO;
    this.position = {
      x: 0,
      y: 0,
    };
    this.limit = limit;
  }
}
