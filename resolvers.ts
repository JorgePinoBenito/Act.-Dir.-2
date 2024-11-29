import { Collection, ObjectId } from "mongodb";
import { Vuelo, VueloModel } from "./types.ts";
import { formModelToVuelo } from "./utils.ts";

export const resolvers = {
  Query: {
    getFlights: async (
      _: unknown,
      { origen, destino }: { origen: string; destino: string },
      context: {
        FlightsCollection: Collection<VueloModel>;
      }
    ): Promise<Vuelo[]> => {
      if (origen && destino) {
        const vuelos = await context.FlightsCollection.find({
          origen,
          destino,
        }).toArray();
        return vuelos.map(formModelToVuelo);
      }
      if (origen) {
        const vuelos = await context.FlightsCollection.find({
          origen,
        }).toArray();
        return vuelos.map(formModelToVuelo);
      }
      if (destino) {
        const vuelos = await context.FlightsCollection.find({
          destino,
        }).toArray();
        return vuelos.map(formModelToVuelo);
      }
      const vuelos = await context.FlightsCollection.find().toArray();
      return vuelos.map(formModelToVuelo);
    },
    getFlight: async (
      _: unknown,
      { id }: { id: string },
      context: {
        FlightsCollection: Collection<VueloModel>;
      }
    ): Promise<Vuelo | null> => {
      const vueloModel = await context.FlightsCollection.findOne({
        _id: new ObjectId(id),
      });
      if (!vueloModel) {
        return null;
      }
      return formModelToVuelo(vueloModel);
    },
  },
  Mutation: {
    addFlight: async (
      _: unknown,
      args: { origen: string; destino: string; fechaHora: string },
      context: {
        FlightsCollection: Collection<VueloModel>;
      }
    ): Promise<Vuelo> => {
      const { origen, destino, fechaHora } = args;
      const { insertedId } = await context.FlightsCollection.insertOne({
        origen,
        destino,
        fechaHora,
      });
      const vueloModel = {
        _id: insertedId,
        origen,
        destino,
        fechaHora,
      };
      return formModelToVuelo(vueloModel!);
    },
  },
};
