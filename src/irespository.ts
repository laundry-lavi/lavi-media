import { PublicObject } from "./entities";

export interface IPublicObjectRepository {
	save(object: PublicObject): Promise<void>;
}