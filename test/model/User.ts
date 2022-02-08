import { Optional } from "../../mod.ts";

export default class User {
  firstName: string;
  lastName: string;
  email: string;
  @Optional()
  country: string;
  @Optional()
  city?: string;
  @Optional()
  phone?: number;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    country: string,
    city?: string,
    phone?: number,
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.country = country;
    this.city = city;
    this.phone = phone;
  }
}
