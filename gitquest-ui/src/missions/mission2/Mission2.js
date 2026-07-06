import { mission2level1 } from "./Mission2Level1";
import { mission2level2 } from "./Mission2Level2";
import { mission2level3 } from "./Mission2Level3";
import { mission2level4 } from "./Mission2Level4";
import { mission2level5 } from "./Mission2Level5";

export const mission2 = {
  id: 'M2', x: 250, y: 138, done: true,
  title: 'Mission 2 — Covert Operations',
  levels: {
    M2L1: mission2level1,
    M2L2: mission2level2,
    M2L3: mission2level3,
    M2L4: mission2level4,
    M2L5: mission2level5,
  }
}