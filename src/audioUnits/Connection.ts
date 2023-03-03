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

  constructor(name: string, type: ConnectionTypes) {
    this.node = CONTEXT.createGain();
    this.type = type;
    this.name = name;
    this.node.gain.value = ZERO;
    this.position = {
      x: 0,
      y: 0,
    };
  }
}
