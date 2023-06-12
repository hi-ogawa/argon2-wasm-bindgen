// export wasm binary as base64 string (~100KB) for simpler downstream consumption
import data from "../pkg/index_bg.wasm";
export default data as unknown as string;
