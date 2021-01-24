import {Media} from "@app/_models/media";
import {User} from "@app/_models/user";
import {SpecialOffer} from "@app/_models/special-offer";

export class Restaurant {
  id: number = 0;
  name: string = '';
  street: string = '';
  zipcode: string = '';
  number: string = '';
  city: string = '';
  description: string = '';
  emailContact: string = '';
  enabled: boolean = true;
  phone:string = '';
  deleted: boolean = false;
  closed: boolean = false;
  numSiret: string = '';
  numSiren: string = '';
  opinions: any[] = [];
  medias: Media[] = [];
  logo: Media = new Media();
  backgroundImg: Media = new Media();
  estimatedPreparationTime: string = '';
  tags: any[] = [];
  managers: User[] = [];
  specialOffer: SpecialOffer;
}
