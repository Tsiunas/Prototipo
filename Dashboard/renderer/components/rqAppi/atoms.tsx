import { atom } from "jotai";

const sessionAtom = atom({ default: true, idsession: -1 });

export { sessionAtom };
