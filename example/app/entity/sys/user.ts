import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column()
  // loginID: string

  @Column()
  name: string;
}

export default User;