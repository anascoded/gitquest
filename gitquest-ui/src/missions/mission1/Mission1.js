import { mission1level1 } from "./Mission1Level1";
import { mission1level2 } from "./Mission1Level2";
import { mission1level3 } from "./Mission1Level3";
import { mission1level4 } from "./Mission1Level4";
import { mission1level5 } from "./Mission1Level5";

export const mission1 = {
  id: 'M1', x: 60, y: 138, done: true,
  title: 'Mission 1 — First Contact',
  levels: {
    M1L1: mission1level1,
    M1L2: mission1level2,
    M1L3: mission1level3,
    M1L4: mission1level4,
    M1L5: mission1level5
  }
}