import { Vuelo, VueloModel } from "./types.ts";

export const formModelToVuelo = (vueloModel: VueloModel): Vuelo => {
  return {
    id: vueloModel._id!.toString(),
    origen: vueloModel.origen,
    destino: vueloModel.destino,
    fechaHora: vueloModel.fechaHora,
  };
};
