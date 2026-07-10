import type { WarriorClass, WarriorGender } from "./warriorPictureVariants";

export interface WarriorSpriteConfig {
  warriorClass: WarriorClass;
  gender: WarriorGender;
  picture: number;
}
