import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Emplacement } from "./emplacement";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  classe: string;

  @OneToMany(() => Emplacement, (emplacement) => emplacement.product)
  emplacements: Emplacement[];
}
