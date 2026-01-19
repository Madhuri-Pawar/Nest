import { SetMetadata } from "@nestjs/common";
import { FEATURE_KEY } from "./feature-key.const";

export const Feature = (feature: string) => SetMetadata(FEATURE_KEY, feature);
