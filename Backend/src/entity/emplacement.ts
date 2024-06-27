import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Product } from "./product";

@Entity()
export class Emplacement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("float")
  x: number;

  @Column("float")
  y: number;

  @Column("float")
  z: number;

  @Column()
  name: string;

  @Column("int")
  qte: number;

  @ManyToOne(() => Product, (product) => product.emplacements)
  product: Product;
}
